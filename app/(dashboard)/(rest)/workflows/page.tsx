import { Suspense } from "react";

import {
  WorkflowsContainer,
  WorkflowsList,
} from "@/features/workflows/components/workflows";

import { LoadingView } from "@/features/workflows/components/entity-components";

const Page = () => {
  return (
    <Suspense fallback={<LoadingView message="Loading workflows..." />}>
      <WorkflowsContainer>
        <WorkflowsList />
      </WorkflowsContainer>
    </Suspense>
  );
};

export default Page;