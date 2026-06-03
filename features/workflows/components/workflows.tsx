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
  PlayIcon,
  ClockIcon,
  GitBranchIcon,
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
    <div className="space-y-4">
      {items.map((workflow) => (
        <a
          key={workflow.id}
          href={`/workflows/${workflow.id}`}
          className="taskorbit-card group flex items-center justify-between p-5"
        >
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-xl bg-white shadow-md flex items-center justify-center">
              <WorkflowIcon className="size-5 text-purple-600" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-900">
                {workflow.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                Updated {new Date(workflow.updatedAt).toLocaleDateString()} •
                Created {new Date(workflow.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="taskorbit-badge-green">
                  Active
                </span>

                <span className="taskorbit-badge-blue flex items-center gap-1">
                  <GitBranchIcon className="size-3" />
                  Steps: 12
                </span>

                <span className="taskorbit-badge-gray flex items-center gap-1">
                  <ClockIcon className="size-3" />
                  Last Run: 5 mins ago
                </span>
              </div>
            </div>
          </div>

          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex items-center gap-2"
          >
            <Button
              size="sm"
              className="taskorbit-button hidden md:flex"
            >
              <PlayIcon className="mr-1 size-4" />
              Run
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md hover:bg-white/70">
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
        </a>
      ))}
    </div>
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