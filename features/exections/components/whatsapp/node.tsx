"use client";

import {
  useReactFlow,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { memo, useState } from "react";

import { BaseExecutionNode } from "../base-execution-node";

import {
  WhatsAppDialog,
  type WhatsAppFormValues,
} from "./dailog";

type WhatsAppNodeData = {
  variableName?: string;
  accessToken?: string;
  phoneNumberId?: string;
  to?: string;
  message?: string;
};

type WhatsAppNodeType = Node<WhatsAppNodeData>;

export const WhatsAppNode = memo(
  (props: NodeProps<WhatsAppNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleSubmit = (values: WhatsAppFormValues) => {
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

    const description = nodeData?.message
      ? `Send: ${nodeData.message.slice(0, 50)}${
          nodeData.message.length > 50 ? "..." : ""
        }`
      : "Not configured";

    return (
      <>
        <WhatsAppDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
        />

        <BaseExecutionNode
          {...props}
          id={props.id}
          icon="/logos/whatsapp.svg"
          name="WhatsApp"
          description={description}
          status="initial"
          onSettings={() => setDialogOpen(true)}
          onDoubleClick={() => setDialogOpen(true)}
        />
      </>
    );
  }
);

WhatsAppNode.displayName = "WhatsAppNode";