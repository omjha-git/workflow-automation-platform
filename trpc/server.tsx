import "server-only";
import { headers } from "next/headers";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import {
  dehydrate,
  HydrationBoundary,
  type QueryClient,
} from "@tanstack/react-query";

import { cache } from "react";

import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: async () => {
    return createTRPCContext({
      headers: await headers(),
    });
  },
  router: appRouter,
  queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(async () => {
  return createTRPCContext({
    headers: await headers(),
  });
});

export function HydrateClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

export function prefetch(queryOptions: any) {
  const queryClient = getQueryClient();

  if (queryOptions.queryKey?.[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}