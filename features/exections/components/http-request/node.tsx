"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";

import { BaseExecutionNode } from "../base-execution-node";

import { httpRequestChannel } from "@/inngest/channels/http-request";
import { useNodeStatus } from "@/features/exections/hooks/use-node-status";
import { fetchHttpRequestRealtimeToken } from "./actions";

import {
  type HttpRequestFormValues,
  HttpRequestDialog,
} from "./dailog";

type HttpRequestNodeData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo(
  (props: NodeProps<HttpRequestNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { setNodes } = useReactFlow();

    const nodeData = props.data as HttpRequestNodeData;

    const nodeStatus = useNodeStatus({
      nodeId: props.id,
      channel: httpRequestChannel().name,
      topic: "status",
      refreshToken: fetchHttpRequestRealtimeToken,
    });

    const description = nodeData?.endpoint
      ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
      : "Not configured";

    const handleOpenSettings = () => {
      setDialogOpen(true);
    };

    const handleSubmit = (values: HttpRequestFormValues) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === props.id) {
            return {
              ...node,
              data: {
                ...node.data,
                variableName: values.variableName,
                endpoint: values.endpoint,
                method: values.method,
                body: values.body,
              },
            };
          }

          return node;
        })
      );

      setDialogOpen(false);
    };

    return (
      <>
        <HttpRequestDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={{
            variableName: nodeData.variableName,
            endpoint: nodeData.endpoint,
            method: nodeData.method,
            body: nodeData.body,
          }}
        />

        <BaseExecutionNode
          {...props}
          status={nodeStatus}
          icon={GlobeIcon}
          name="HTTP Request"
          description={description}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </>
    );
  }
);

HttpRequestNode.displayName = "HttpRequestNode";