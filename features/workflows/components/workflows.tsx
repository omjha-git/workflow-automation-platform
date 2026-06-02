"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVerticalIcon,
  TrashIcon,
  WorkflowIcon,
} from "lucide-react";

import { useWorkflowsParams } from "../hooks/use-workflows-params";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";

import {
  EntityHeader,
  EntityContainer,
  EntitySearch,
  LoadingView,
  ErrorView,
  EmptyView,
  EntityList,
  EntityItem,
} from "./entity-components";

type WorkflowItem = {
  id: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntitySearch
      value={params.search}
      onChange={(value) => {
        setParams({
          search: value,
          page: 1,
        });
      }}
      placeholder="Search workflows"
    />
  );
};

export const WorkflowsList = () => {
  const removeWorkflow = useRemoveWorkflow();
  const workflows = useSuspenseWorkflows();

  const items = workflows.data.items as WorkflowItem[];

  if (items.length === 0) {
    return <WorkflowsEmpty />;
  }

  return (
    <EntityList
      items={items}
      emptyView={<WorkflowsEmpty />}
      getKey={(workflow: WorkflowItem) => workflow.id}
      renderItem={(workflow: WorkflowItem) => (
        <EntityItem
          href={`/workflows/${workflow.id}`}
          title={workflow.name}
          subtitle={
            <>
              Updated{" "}
              {new Date(workflow.updatedAt).toLocaleDateString()}
              {" • "}
              Created{" "}
              {new Date(workflow.createdAt).toLocaleDateString()}
            </>
          }
          image={
            <div className="size-8 rounded-md border flex items-center justify-center">
              <WorkflowIcon className="size-4 text-muted-foreground" />
            </div>
          }
          actions={
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted">
                  <MoreVerticalIcon className="size-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      removeWorkflow.mutate({
                        id: workflow.id,
                      });
                    }}
                  >
                    <TrashIcon className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          }
        />
      )}
    />
  );
};

export const WorkflowsHeader = ({
  disabled,
}: {
  disabled?: boolean;
}) => {
  const createWorkflow = useCreateWorkflow();

  return (
    <EntityHeader
      title="Workflows"
      description="Create and manage your workflows"
      onNew={() => createWorkflow.mutate()}
      newButtonLabel="New workflow"
      disabled={disabled}
      isCreating={createWorkflow.isPending}
    />
  );
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
    >
      {children}
    </EntityContainer>
  );
};

export const WorkflowsLoading = () => {
  return <LoadingView entity="workflows" />;
};

export const WorkflowsError = () => {
  return <ErrorView message="Error loading workflows" />;
};

export const WorkflowsEmpty = () => {
  const createWorkflow = useCreateWorkflow();

  return (
    <EmptyView
      message="You haven't created any workflows yet. Get started by creating your first workflow"
      onNew={() => createWorkflow.mutate()}
    />
  );
};