import { Suspense } from "react";

import {
  WorkflowsContainer,
  WorkflowsHeader,
  WorkflowsList,
  WorkflowsSearch,
} from "@/features/workflows/components/workflows";

import { LoadingView } from "@/features/workflows/components/entity-components";

const PageContent = () => {
  return (
    <WorkflowsContainer>
      <WorkflowsHeader />

      <WorkflowsSearch />
      <WorkflowsList />
    </WorkflowsContainer>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<LoadingView message="Loading workflows..." />}>
      <PageContent />
    </Suspense>
  );
};

export default Page;