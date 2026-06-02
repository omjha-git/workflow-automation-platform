"use client";

import Image from "next/image";
import { memo, type ReactNode, useCallback } from "react";
import {
  Position,
  type NodeProps,
  useReactFlow,
} from "@xyflow/react";
import type { LucideIcon } from "lucide-react";

import {
  BaseNode,
  BaseNodeContent,
} from "@/components/react-flow/base-node";

import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";
import {
  type NodeStatus,
  NodeStatusIndicator,
} from "@/components/react-flow/node-status-indicator";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    status = "initial",
    children,
    onSettings,
    onDoubleClick,
  }: BaseTriggerNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();

    const handleDelete = useCallback(() => {
      setNodes((currentNodes) =>
        currentNodes.filter((node) => node.id !== id)
      );

      setEdges((currentEdges) =>
        currentEdges.filter(
          (edge) =>
            edge.source !== id &&
            edge.target !== id
        )
      );
    }, [id, setNodes, setEdges]);

    return (
      <WorkflowNode
  showToolbar
  name={name}
  description={description}
  onDelete={handleDelete}
  onSettings={onSettings}
>
  <NodeStatusIndicator
    status={status}
    variant="border"
  >
    <BaseNode onDoubleClick={onDoubleClick}>
      <BaseNodeContent>
        {typeof Icon === "string" ? (
          <Image
            src={Icon}
            alt={name}
            width={16}
            height={16}
          />
        ) : (
          <Icon className="size-4 text-muted-foreground" />
        )}

        {children}

        <BaseHandle
          id="source-1"
          type="source"
          position={Position.Right}
        />
      </BaseNodeContent>
    </BaseNode>
  </NodeStatusIndicator>
</WorkflowNode>
    );
  }
);

BaseTriggerNode.displayName = "BaseTriggerNode";