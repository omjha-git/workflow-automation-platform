import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { prefetchWorkflow } from "@/features/workflows/server/prefetch";

import {
  Editor,
  EditorLoading,
  EditorError,
} from "@/features/editor/components/editor";

interface PageProps {
  params: Promise<{
    workflowId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await auth.api.getSession({
    headers: await headers(),
  });

  const { workflowId } = await params;

  prefetchWorkflow(workflowId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <Editor workflowId={workflowId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;