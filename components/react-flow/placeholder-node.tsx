"use client";

import {
  forwardRef,
  type ReactNode,
} from "react";

import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import { BaseNode } from "@/components/react-flow/base-node";

export type PlaceholderNodeProps =
  Partial<NodeProps> & {
    onClick?: () => void;
    children?: ReactNode;
    description?: string;
  };

export const PlaceholderNode =
  forwardRef<
    HTMLDivElement,
    PlaceholderNodeProps
  >(
    (
      {
        children,
        onClick,
        description,
      },
      ref
    ) => {
      return (
        <BaseNode
          ref={ref}
          className="
            w-auto
            h-auto
            border-dashed
            border-gray-400
            bg-card
            p-4
            text-center
            text-gray-400
            shadow-none
            cursor-pointer
            hover:border-gray-500
            hover:bg-gray-50
          "
          onClick={onClick}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            {children}

            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>

          <Handle
            type="target"
            style={{
              visibility: "hidden",
            }}
            position={Position.Top}
            isConnectable={false}
          />

          <Handle
            type="source"
            style={{
              visibility: "hidden",
            }}
            position={Position.Bottom}
            isConnectable={false}
          />
        </BaseNode>
      );
    }
  );

PlaceholderNode.displayName =
  "PlaceholderNode";