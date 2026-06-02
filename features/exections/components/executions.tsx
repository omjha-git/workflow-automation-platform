"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { useSuspenseExecutions } from "../hooks/use-executions";

type ExecutionItem = {
  id: string;
  status: string;
  workflow: {
    name: string;
  };
};

export const ExecutionsContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Executions</h1>
      <div className="mt-6">{children}</div>
    </div>
  );
};

export const ExecutionsList = () => {
  const { data } = useSuspenseExecutions();

  const items = data.items as ExecutionItem[];

  if (!items.length) {
    return <div>No executions found</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((execution) => (
        <Link
          key={execution.id}
          href={`/execution/${execution.id}`}
          className="block rounded-lg border p-4 hover:bg-muted"
        >
          <p className="font-medium">{execution.workflow.name}</p>
          <p className="text-sm text-muted-foreground">
            {execution.id}
          </p>
          <p className="text-sm font-medium">
            {execution.status}
          </p>
        </Link>
      ))}
    </div>
  );
};

export const ExecutionsLoading = () => {
  return <div>Loading...</div>;
};

export const ExecutionsError = () => {
  return <div>Error</div>;
};