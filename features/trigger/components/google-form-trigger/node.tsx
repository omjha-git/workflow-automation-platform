"use client";

import type { NodeProps } from "@xyflow/react";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";

import { fetchGoogleFormTriggerRealtimeToken } from "./actions";
import { useNodeStatus } from "@/features/exections/hooks/use-node-status";
import { memo, useState } from "react";

import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";

export const GoogleFormTrigger = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
  nodeId: props.id,
  channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
  topic: "status",
  refreshToken: fetchGoogleFormTriggerRealtimeToken,
});

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <GoogleFormTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <BaseTriggerNode
        {...props}
        icon="/logos/googleform.svg"
        name="Google-form"
        description="when form is submitted"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

GoogleFormTrigger.displayName = "GoogleFormTrigger";