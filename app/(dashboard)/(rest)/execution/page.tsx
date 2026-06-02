import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { type SearchParams } from "nuqs";

import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";

import { executionsParamsLoader } from "@/features/exections/server/params-loader";
import { prefetchExecutions } from "@/features/exections/server/prefetch";

import {
  ExecutionsContainer,
  ExecutionsList,
  ExecutionsLoading,
  ExecutionsError,
} from "@/features/exections/components/executions";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await executionsParamsLoader(searchParams);

  prefetchExecutions(params);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ExecutionsError />}>
        <Suspense fallback={<ExecutionsLoading />}>
          <ExecutionsContainer>
            <ExecutionsList />
          </ExecutionsContainer>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;