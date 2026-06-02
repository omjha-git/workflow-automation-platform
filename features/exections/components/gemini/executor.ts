import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

import prisma from "@/lib/db";
import type { NodeExecutor } from "../../types";
import { geminiChannel } from "@/inngest/channels/gemini";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

export type GeminiData = {
  variableName?: string;
  credentialId?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    geminiChannel().status({
      nodeId,
      status: "loading",
    })
  );

  try {
    if (!data.variableName) {
      throw new NonRetriableError("Gemini node: Variable name is missing");
    }

    if (!data.credentialId) {
      throw new NonRetriableError("Gemini node: Credential is required");
    }

    if (!data.userPrompt) {
      throw new NonRetriableError("Gemini node: User prompt is missing");
    }

    const systemPrompt = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : "You are a helpful assistant.";

    const userPrompt = Handlebars.compile(data.userPrompt)(context);

    // IMPORTANT:
    // Do not use step.run here.
    // This executor already runs inside a step.run from functions.ts.
    const credential = await prisma.credential.findUnique({
      where: {
        id: data.credentialId,
      },
    });

    if (!credential) {
      throw new NonRetriableError("Gemini node: Credential not found");
    }

    const google = createGoogleGenerativeAI({
      apiKey: credential.value,
    });

    const aiResult = await generateText({
  model: google(data.model ?? "gemini-2.5-flash"),
  system: systemPrompt,
  prompt: userPrompt,
});

    const text = aiResult.text ?? JSON.stringify(aiResult, null, 2);

    await publish(
      geminiChannel().status({
        nodeId,
        status: "success",
      })
    );

    return {
      ...context,
      [data.variableName]: {
        text,
        aiResponse: text,
      },
    };
  } catch (error) {
    await publish(
      geminiChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw error;
  }
};