import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { type SearchParams } from "nuqs";

import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";

import { credentialsParamsLoader } from "@/features/credentials/server/params-loader";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";

import {
  CredentialsContainer,
  CredentialsList,
  CredentialsLoading,
  CredentialsError,
} from "@/features/credentials/components/credentials";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await credentialsParamsLoader(searchParams);

  prefetchCredentials(params);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<CredentialsError />}>
        <Suspense fallback={<CredentialsLoading />}>
          <CredentialsContainer>
            <CredentialsList />
          </CredentialsContainer>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;