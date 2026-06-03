import { Suspense } from "react";

import {
  WorkflowsContainer,
  WorkflowsList,
} from "@/features/workflows/components/workflows";

import { LoadingView } from "@/features/workflows/components/entity-components";

const Page = () => {
  return (
    <WorkflowsContainer>
      <Suspense fallback={<LoadingView message="Loading workflows..." />}>
        <WorkflowsList />
      </Suspense>
    </WorkflowsContainer>
  );
};

export default Page;