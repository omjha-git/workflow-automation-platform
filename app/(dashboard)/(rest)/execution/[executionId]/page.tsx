import { Suspense } from "react";

import { ExecutionDetails } from "@/features/exections/components/execution-details";

interface PageProps {
  params: Promise<{
    executionId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { executionId } = await params;

  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ExecutionDetails executionId={executionId} />
    </Suspense>
  );
};

export default Page;