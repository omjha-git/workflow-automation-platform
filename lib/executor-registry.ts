import { NodeType } from "@prisma/client";

import type { NodeExecutor } from "../features/exections/types";

import { manualTriggerExecutor } from "@/features/trigger/components/manual-trigger/executor";
import { googleFormTriggerExecutor } from "@/features/trigger/components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/trigger/components/stripe-trigger/executor";

import { httpRequestExecutor } from "@/features/exections/components/executor";
import { geminiExecutor } from "@/features/exections/components/gemini/executor";
import { discordExecutor } from "@/features/exections/components/discord/executor";
import { whatsappExecutor } from "@/features/exections/components/whatsapp/executor";

export const executorRegistry: Partial<
  Record<NodeType, NodeExecutor>
> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,

  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.DISCORD]: discordExecutor,
  [NodeType.WHATSAPP]: whatsappExecutor,
};

export const getExecutor = (
  type: NodeType
): NodeExecutor => {
  const executor = executorRegistry[type];

  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};