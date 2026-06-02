"use client";

import { useCallback, useMemo, useState } from "react";
import { NodeType } from "@prisma/client";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
  LoadingView,
  ErrorView,
} from "@/features/workflows/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { nodeComponents } from "@/config/node-component";
import { EditorHeader } from "./editor-header";
import { AddNodeButton } from "@/components/add-node-button";
import { NodeSelector } from "@/components/node-selector";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { ExecuteWorkflowButton } from "./execute-workflow-button";

type WorkflowEditorData = {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
};

export const EditorLoading = () => {
  return <LoadingView message="Loading workflow..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading workflow" />;
};

export const Editor = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const [open, setOpen] = useState(false);
  const setEditor = useSetAtom(editorAtom);

  const { data } = useSuspenseWorkflow(workflowId);
  const workflow = data as WorkflowEditorData;

  const [nodes, setNodes] = useState<Node[]>(
    workflow.nodes ?? []
  );

  const [edges, setEdges] = useState<Edge[]>(
    workflow.edges ?? []
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nodesSnapshot) =>
        applyNodeChanges(changes, nodesSnapshot)
      );
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((edgesSnapshot) =>
        applyEdgeChanges(changes, edgesSnapshot)
      );
    },
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((edgesSnapshot) =>
        addEdge(connection, edgesSnapshot)
      );
    },
    []
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some(
      (node) =>
        node.type === NodeType.MANUAL_TRIGGER
    );
  }, [nodes]);

  return (
    <div className="flex h-full flex-col">
      <EditorHeader workflowId={workflowId} />

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeComponents}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setEditor}
          fitView
          snapGrid={[10, 10]}
          snapToGrid
          panOnScroll
          panOnDrag={false}
          selectNodesOnDrag
        >
          <Background />
          <Controls />
          <MiniMap />

          <Panel position="top-right">
            <AddNodeButton
              onClick={() => setOpen(true)}
            />
          </Panel>

          {hasManualTrigger && (
            <Panel position="bottom-right">
              <ExecuteWorkflowButton
                workflowId={workflowId}
              />
            </Panel>
          )}

          <NodeSelector
            open={open}
            onOpenChange={setOpen}
          />
        </ReactFlow>
      </div>
    </div>
  );
};