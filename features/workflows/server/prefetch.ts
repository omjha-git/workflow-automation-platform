import { prefetch, trpc } from "@/trpc/server";

type Params = {
  page: number;
  pageSize: number;
  search: string;
};

export const prefetchWorkflows = (
  params: Params
) => {
  return prefetch(
    trpc.workflows.getMany.queryOptions(params)
  );
};

export const prefetchWorkflow = (
  id: string
) => {
  return prefetch(
    trpc.workflows.getOne.queryOptions({
      id,
    })
  );
};