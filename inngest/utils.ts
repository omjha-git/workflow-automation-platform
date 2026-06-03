import toposort from "toposort";
import { inngest } from "./client";

type Node = {
  id: string;
  type: string;
  data: unknown;
  position?: unknown;
};

type Connection = {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromOutput?: string | null;
  toInput?: string | null;
};

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  if (connections.length === 0) {
    return nodes;
  }

  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ]);

  const connectedNodeIds = new Set<string>();

  for (const conn of connections) {
    connectedNodeIds.add(conn.fromNodeId);
    connectedNodeIds.add(conn.toNodeId);
  }

  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  let sortedNodeIds: string[];

  try {
    sortedNodeIds = [...new Set(toposort(edges))];
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Cyclic")
    ) {
      throw new Error("Workflow contains a cycle");
    }

    throw error;
  }

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return sortedNodeIds
    .map((id) => nodeMap.get(id)!)
    .filter(Boolean);
};

export const sendWorkflowExecution = async (data: {
  workflowId: string;
  [key: string]: unknown;
}) => {
  return inngest.send({
    name: "workflows/execute.workflow",
    data,
  });
};