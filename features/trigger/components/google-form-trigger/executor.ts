import type { NodeExecutor } from "@/features/exections/types";

type GoogleFormTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<
  GoogleFormTriggerData
> = async ({ context }) => {
  return context;
};