"use client";

import {
  useReactFlow,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { memo, useState } from "react";

import { BaseExecutionNode } from "../base-execution-node";

import {
  DiscordDialog,
  type DiscordFormValues,
} from "./dailog";

type DiscordNodeData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo(
  (props: NodeProps<DiscordNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleSubmit = (values: DiscordFormValues) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id !== props.id) return node;

          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        })
      );

      setDialogOpen(false);
    };

    const nodeData = props.data;

    const description = nodeData?.content
      ? `Send: ${nodeData.content.slice(0, 50)}${
          nodeData.content.length > 50 ? "..." : ""
        }`
      : "Not configured";

    return (
      <>
        <DiscordDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
        />

        <BaseExecutionNode
          {...props}
          id={props.id}
          icon="/logos/discord.svg"
          name="Discord"
          description={description}
          status="initial"
          onSettings={() => setDialogOpen(true)}
          onDoubleClick={() => setDialogOpen(true)}
        />
      </>
    );
  }
);

DiscordNode.displayName = "DiscordNode";