"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";

import { PlaceholderNode } from "./react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";

export const InitialNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <WorkflowNode
        showToolbar
        name="Initial"
        description="Add a first step"
      >
        <PlaceholderNode
          {...props}
          onClick={() => setOpen(true)}
        >
          <div className="flex cursor-pointer items-center justify-center">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>

      <NodeSelector
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
});

InitialNode.displayName = "InitialNode";