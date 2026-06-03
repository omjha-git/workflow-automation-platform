import toposort from "toposort";
import { inngest } from "./client";

type Node = {
  id: string;
  type: string;
  data: unknown;
  position?: unknown;
};

type Connection = {
  id?: string;
  fromNodeId?: string;
  toNodeId?: string;
  source?: string;
  target?: string;
  fromOutput?: string | null;
  toInput?: string | null;
};

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  if (connections.length === 0) {
    return nodes.filter((node) => node.type !== "INITIAL");
  }

  const edges: [string, string][] = connections.map((conn) => {
    const source = conn.fromNodeId ?? conn.source;
    const target = conn.toNodeId ?? conn.target;

    if (!source || !target) {
      throw new Error("Invalid connection");
    }

    return [source, target];
  });

  const connectedNodeIds = new Set<string>();

  for (const [source, target] of edges) {
    connectedNodeIds.add(source);
    connectedNodeIds.add(target);
  }

  const connectedNodes = nodes.filter((node) =>
    connectedNodeIds.has(node.id)
  );

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

  const nodeMap = new Map(
    connectedNodes.map((node) => [node.id, node])
  );

  return sortedNodeIds
    .map((id) => nodeMap.get(id))
    .filter((node): node is Node => Boolean(node));
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