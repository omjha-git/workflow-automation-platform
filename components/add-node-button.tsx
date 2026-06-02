"use client";

import { memo } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type AddNodeButtonProps = {
  onClick?: () => void;
};

export const AddNodeButton = memo(
  ({ onClick }: AddNodeButtonProps) => {
    return (
      <Button
        onClick={onClick}
        size="icon"
        variant="outline"
        className="bg-background"
      >
        <PlusIcon className="size-4" />
      </Button>
    );
  }
);

AddNodeButton.displayName = "AddNodeButton";