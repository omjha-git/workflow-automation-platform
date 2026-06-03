import { NonRetriableError } from "inngest";

import { inngest } from "./client";
import prisma from "../lib/db";
import { topologicalSort } from "./utils";
import { getExecutor } from "../lib/executor-registry";

import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";
import { discordChannel } from "./channels/discord";

const NodeType = {
  INITIAL: "INITIAL",
  MANUAL_TRIGGER: "MANUAL_TRIGGER",
  GOOGLE_FORM_TRIGGER: "GOOGLE_FORM_TRIGGER",
  STRIPE_TRIGGER: "STRIPE_TRIGGER",
  HTTP_REQUEST: "HTTP_REQUEST",
  GEMINI: "GEMINI",
  DISCORD: "DISCORD",
  WHATSAPP: "WHATSAPP",
} as const;

type NodeTypeValue =
  (typeof NodeType)[keyof typeof NodeType];

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0,
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      discordChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is missing");
    }

    const execution = await step.run("create-execution", async () => {
      return await prisma.execution.create({
        data: {
          workflowId,
          status: "RUNNING",
          inngestEventId: event.id ?? "",
          startedAt: new Date(),
        },
      });
    });

    try {
      const sortedNodes = await step.run("prepare-workflow", async () => {
        const workflow = await prisma.workflow.findUniqueOrThrow({
          where: {
            id: workflowId,
          },
          include: {
            nodes: true,
            connections: true,
          },
        });

        console.log(
          "DB NODES:",
          workflow.nodes.map((node) => ({
            id: node.id,
            type: node.type,
            data: node.data,
          }))
        );

        console.log("DB CONNECTIONS:", workflow.connections);

        const nodes = topologicalSort(
          workflow.nodes,
          workflow.connections
        );

        console.log(
          "Sorted nodes:",
          nodes.map((node) => ({
            id: node.id,
            type: node.type,
            data: node.data,
          }))
        );

        return nodes;
      });

      let context: Record<string, unknown> =
        event.data.initialData || {};

      for (const node of sortedNodes) {
        console.log("Executing node:", node.type, node.id);

        const executor = getExecutor(node.type as NodeTypeValue);

        context = await step.run(
          `execute-${node.type}-${node.id}`,
          async () => {
            console.log("RUNNING EXECUTOR:", node.type);

            return await executor({
              data: node.data as Record<string, unknown>,
              nodeId: node.id,
              context,
              step,
              publish,
            });
          }
        );
      }

      await step.run("complete-execution", async () => {
        return await prisma.execution.update({
          where: {
            id: execution.id,
          },
          data: {
            status: "SUCCESS",
            output: context as object,
            completedAt: new Date(),
          },
        });
      });

      return {
        success: true,
        workflowId,
        executionId: execution.id,
        result: context,
      };
    } catch (error) {
      await step.run("fail-execution", async () => {
        return await prisma.execution.update({
          where: {
            id: execution.id,
          },
          data: {
            status: "FAILED",
            error:
              error instanceof Error
                ? error.message
                : "Unknown error",
            errorStack:
              error instanceof Error ? error.stack : null,
            completedAt: new Date(),
          },
        });
      });

      throw error;
    }
  }
);