
"use client";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  AlertTriangleIcon,
  Loader2Icon,
  PlusIcon,
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
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <Button onClick={onNew} disabled={disabled || isCreating}>
        {isCreating ? "Creating..." : `+ ${newButtonLabel}`}
      </Button>
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
    <div className="flex flex-col gap-y-6 p-6">
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
      <SearchIcon
        className="
          size-3.5
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-muted-foreground
        "
      />

      <Input
        className="
          max-w-[200px]
          bg-background
          shadow-none
          border-border
          pl-8
        "
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
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
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <Loader2Icon className="size-6 animate-spin text-muted-foreground" />

      <p className="text-sm text-muted-foreground">
        {message || `Loading ${entity}`}
      </p>
    </div>
  );
};

export const ErrorView = ({
  message,
}: StateViewProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <AlertTriangleIcon
        className="size-6 text-primary"
      />

      {!!message && (
        <p className="text-sm text-muted-foreground">
          {message}
        </p>
      )}
    </div>
  );
};

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void;
}

export const EmptyView = ({
  message,
  onNew,
}: EmptyViewProps) => {
  return (
    <Empty className="min-h-[400px] border border-dashed bg-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon />
        </EmptyMedia>

        <EmptyTitle>No items</EmptyTitle>

        <EmptyDescription>
          {message}
        </EmptyDescription>
      </EmptyHeader>

      {onNew && (
        <EmptyContent>
          <Button onClick={onNew}>
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
    return (
      <div>
        {emptyView}
      </div>
    );
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
          "p-4 shadow-none hover:shadow cursor-pointer",
          isRemoving &&
            "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <CardContent className="flex items-center justify-between p-0">
          <div className="flex items-center gap-x-3">
            {image}

            <div>
              <CardTitle>
                {title}
              </CardTitle>

              {subtitle && (
                <CardDescription className="text-xs">
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