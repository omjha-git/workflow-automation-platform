"use client";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  AlertTriangleIcon,
  Loader2Icon,
  SearchIcon,
  PackageOpenIcon,
} from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type EntityHeaderProps = {
  title: string;
  description?: string;
  onNew?: () => void;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
};

export const EntityHeader = ({
  title,
  description,
  onNew,
  newButtonLabel = "New",
  disabled,
  isCreating,
}: EntityHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          {title}
        </h1>

        {description && (
          <p className="text-sm text-slate-600">{description}</p>
        )}
      </div>

      {onNew && (
        <Button
          onClick={onNew}
          disabled={disabled || isCreating}
          className="rounded-xl border-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/30 hover:opacity-90"
        >
          {isCreating ? "Creating..." : `+ ${newButtonLabel}`}
        </Button>
      )}
    </div>
  );
};

type EntityContainerProps = {
  children: React.ReactNode;
  header: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

export const EntityContainer = ({
  children,
  header,
  search,
  pagination,
}: EntityContainerProps) => {
  return (
    <div className="flex flex-col gap-y-7 p-8">
      {header}
      {search}
      {children}
      {pagination}
    </div>
  );
};

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search",
}: EntitySearchProps) => {
  return (
    <div className="relative ml-auto">
      <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-pink-500" />

      <Input
        className="h-11 max-w-[260px] rounded-xl border-pink-300 bg-white/80 pl-10 shadow-lg shadow-purple-500/10 backdrop-blur-md transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-300"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

interface StateViewProps {
  message?: string;
}

interface LoadingViewProps extends StateViewProps {
  entity?: string;
}

export const LoadingView = ({
  entity = "items",
  message,
}: LoadingViewProps) => {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4">
      <Loader2Icon className="size-6 animate-spin text-purple-600" />

      <p className="text-sm text-slate-600">
        {message || `Loading ${entity}`}
      </p>
    </div>
  );
};

export const ErrorView = ({ message }: StateViewProps) => {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4">
      <AlertTriangleIcon className="size-6 text-red-500" />

      {!!message && <p className="text-sm text-slate-600">{message}</p>}
    </div>
  );
};

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void;
}

export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
  return (
    <Empty className="min-h-[400px] rounded-3xl border border-dashed border-purple-300 bg-white/70 shadow-xl shadow-purple-500/10 backdrop-blur-md">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon />
        </EmptyMedia>

        <EmptyTitle>No items</EmptyTitle>

        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>

      {onNew && (
        <EmptyContent>
          <Button
            onClick={onNew}
            className="rounded-xl border-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/30"
          >
            Add item
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
}

export function EntityList<T>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
}: EntityListProps<T>) {
  if (items.length === 0 && emptyView) {
    return <div>{emptyView}</div>;
  }

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

interface EntityItemProps {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
}

export const EntityItem = ({
  href,
  title,
  subtitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}: EntityItemProps) => {
  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          "cursor-pointer rounded-3xl border border-purple-200 bg-gradient-to-r from-cyan-50 via-purple-50 to-pink-50 p-5 shadow-xl shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-pink-500/20",
          isRemoving && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <CardContent className="flex items-center justify-between p-0">
          <div className="flex items-center gap-x-4">
            {image}

            <div>
              <CardTitle className="text-lg font-bold text-slate-800">
                {title}
              </CardTitle>

              {subtitle && (
                <CardDescription className="text-sm text-slate-500">
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </div>

          {(actions || onRemove) && (
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {actions}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};