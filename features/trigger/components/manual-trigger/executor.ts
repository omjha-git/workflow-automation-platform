import type {
  NodeExecutor,
  NodeExecutorParams,
} from "@/features/exections/types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<
  ManualTriggerData
> = async ({
  context,
}: NodeExecutorParams<ManualTriggerData>) => {
  return context;
};