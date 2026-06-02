"use client";

import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";

import { BaseTriggerNode } from "../base-trigger-node";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo(
  (props: NodeProps) => {
    const [isDialogOpen, setIsDialogOpen] =
      useState(false);

    return (
      <>
        <BaseTriggerNode
          {...props}
          status="loading"
          icon={MousePointerIcon}
          name="When clicking 'Execute workflow'"
          onSettings={() =>
            setIsDialogOpen(true)
          }
          onDoubleClick={() =>
            setIsDialogOpen(true)
          }
        />

        <ManualTriggerDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </>
    );
  }
);

ManualTriggerNode.displayName =
  "ManualTriggerNode";