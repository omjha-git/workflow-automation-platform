"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { SaveIcon } from "lucide-react";
import { useAtomValue } from "jotai";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  useSuspenseWorkflow,
  useUpdateWorkflow,
  useUpdateWorkflowName,
} from "@/features/workflows/hooks/use-workflows";

import { editorAtom } from "../store/atoms";

export const EditorSaveButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const editor = useAtomValue(editorAtom);
  const saveWorkflow = useUpdateWorkflow();

  const handleSave = () => {
    if (!editor) return;

   const nodes = editor.getNodes().map((node) => ({
  id: node.id,
  type: node.type ?? "INITIAL",
  position: {
    x: node.position.x,
    y: node.position.y,
  },
  data: (node.data ?? {}) as Record<string, unknown>,
}));

    const edges = editor.getEdges().map((edge) => ({
      source: edge.source,
      target: edge.target,
      sourceHandle:
        edge.sourceHandle ?? null,
      targetHandle:
        edge.targetHandle ?? null,
    }));

    saveWorkflow.mutate({
      id: workflowId,
      nodes,
      edges,
    });
  };

  return (
    <div className="ml-auto">
      <Button
        onClick={handleSave}
        disabled={saveWorkflow.isPending}
      >
        <SaveIcon className="size-4 mr-2" />
        {saveWorkflow.isPending
          ? "Saving..."
          : "Save"}
      </Button>
    </div>
  );
};

export const EditorNameInput = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const { data: workflow } =
    useSuspenseWorkflow(workflowId);

  const updateName =
    useUpdateWorkflowName();

  const [name, setName] = useState(
    workflow?.name ?? ""
  );

  const inputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(workflow?.name ?? "");
  }, [workflow]);

  const handleSave = () => {
    const trimmedName = name.trim();

    if (
      !trimmedName ||
      trimmedName === workflow?.name
    ) {
      return;
    }

    updateName.mutate({
      id: workflowId,
      name: trimmedName,
    });
  };

  return (
    <Input
      ref={inputRef}
      value={name}
      onChange={(e) =>
        setName(e.target.value)
      }
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSave();
          inputRef.current?.blur();
        }
      }}
      disabled={updateName.isPending}
      className="
        border-none
        shadow-none
        p-0
        h-auto
        text-lg
        font-semibold
        focus-visible:ring-0
        max-w-[300px]
      "
    />
  );
};

export const EditorBreadcrumbs = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  return (
    <div className="flex items-center gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/workflows">
              Workflows
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <EditorNameInput
        workflowId={workflowId}
      />
    </div>
  );
};

export const EditorHeader = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  return (
    <header
      className="
        flex
        h-14
        shrink-0
        items-center
        gap-2
        border-b
        px-4
        bg-background
      "
    >
      <SidebarTrigger />

      <div
        className="
          flex
          items-center
          justify-between
          w-full
        "
      >
        <EditorBreadcrumbs
          workflowId={workflowId}
        />

        <EditorSaveButton
          workflowId={workflowId}
        />
      </div>
    </header>
  );
};