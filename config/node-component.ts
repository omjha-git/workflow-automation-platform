import type { NodeTypes } from "@xyflow/react";

import { NodeType } from "@prisma/client";

import { InitialNode } from "../components/initial-node";

import { HttpRequestNode } from "../features/exections/components/http-request/node";
import { GeminiNode } from "../features/exections/components/gemini/node";
import { DiscordNode } from "@/features/exections/components/discord/node";
import { WhatsAppNode } from "@/features/exections/components/whatsapp/node";

import { ManualTriggerNode } from "../features/trigger/components/manual-trigger/node";
import { GoogleFormTrigger } from "../features/trigger/components/google-form-trigger/node";
import { StripeTriggerNode } from "../features/trigger/components/stripe-trigger/node";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,

  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,

  [NodeType.GEMINI]: GeminiNode,
  [NodeType.DISCORD]: DiscordNode,
  [NodeType.WHATSAPP]: WhatsAppNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType =
  keyof typeof nodeComponents;