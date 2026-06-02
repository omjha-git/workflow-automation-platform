"use client";

import {
  forwardRef,
  type ComponentProps,
} from "react";

import {
  CheckCircle2Icon,
  CircleIcon,
  Loader2Icon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type BaseNodeStatus =
  | "initial"
  | "loading"
  | "success"
  | "error";

interface BaseNodeProps
  extends ComponentProps<"div"> {
  status?: BaseNodeStatus;
}

export const BaseNode = forwardRef<
  HTMLDivElement,
  BaseNodeProps
>(
  (
    {
      className,
      status = "initial",
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-sm border",
        "border-muted-foreground bg-card",
        "text-card-foreground hover:bg-accent",
        className
      )}
      tabIndex={0}
      {...props}
    >
      {props.children}

      {status === "error" && (
        <CircleIcon
          className="absolute right-0.5 bottom-0.5 size-2 text-red-700 stroke-3"
        />
      )}

      {status === "success" && (
        <CheckCircle2Icon
          className="absolute right-0.5 bottom-0.5 size-2 text-green-700 stroke-3"
        />
      )}

      {status === "loading" && (
        <Loader2Icon
          className="absolute right-0.5 bottom-0.5 size-3 animate-spin text-blue-700"
        />
      )}
    </div>
  )
);

BaseNode.displayName = "BaseNode";

export function BaseNodeHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "mx-0 my-0 -mb-1 flex flex-row items-center justify-between gap-2 px-3 py-2",
        className
      )}
    />
  );
}

export function BaseNodeHeaderTitle({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn(
        "user-select-none flex-1 font-semibold",
        className
      )}
      {...props}
    />
  );
}

export function BaseNodeContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-content"
      className={cn(
        "flex flex-col gap-y-2 p-3",
        className
      )}
      {...props}
    />
  );
}

export function BaseNodeFooter({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn(
        "flex flex-col items-center gap-y-2 border-t px-3 pt-2 pb-3",
        className
      )}
      {...props}
    />
  );
}