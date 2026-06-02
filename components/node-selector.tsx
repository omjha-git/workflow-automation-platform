"use client";

import Image from "next/image";

import { createId } from "@paralleldrive/cuid2";
import {
  useReactFlow,
  type Node,
} from "@xyflow/react";
import {
  GlobeIcon,
  MousePointerIcon,
} from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Separator } from "@/components/ui/separator";
import { NodeType } from "@prisma/client";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon:
    | React.ComponentType<{
        className?: string;
      }>
    | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description:
      "Runs the workflow when clicking a button.",
    icon: MousePointerIcon,
  },

  {
  type: NodeType.GOOGLE_FORM_TRIGGER,
  label: "Google Form",
  description:
    "Runs the flow when a Google Form is submitted",
  icon: "/logos/googleform.svg",
},

{
  type: NodeType.STRIPE_TRIGGER,
  label: "Stripe Event",
  description: "Runs the flow when a Stripe event is captured",
  icon: "/logos/stripe.svg",
},

];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an HTTP request.",
    icon: GlobeIcon,
  },
  {
  type: NodeType.GEMINI,
  label: "Gemini",
  description: "Uses Google Gemini to generate text",
  icon: "/logos/gemini.svg",
},
{
  type: NodeType.DISCORD,
  label: "Discord",
  description: "Send a message to Discord",
  icon: "/logos/discord.svg",
},

{
  type: NodeType.WHATSAPP,
  label: "WhatsApp",
  description: "Send a WhatsApp message",
  icon: "/logos/whatsapp.svg",
},
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NodeSelector({
  open,
  onOpenChange,
}: NodeSelectorProps) {
  const {
    setNodes,
    getNodes,
    screenToFlowPosition,
  } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (
        selection.type ===
        NodeType.MANUAL_TRIGGER
      ) {
        const nodes = getNodes();

        const hasManualTrigger =
          nodes.some(
            (node) =>
              node.type ===
              NodeType.MANUAL_TRIGGER
          );

        if (hasManualTrigger) {
          toast.error(
            "Only one manual trigger is allowed per workflow"
          );
          return;
        }
      }

      const centerX =
        window.innerWidth / 2;
      const centerY =
        window.innerHeight / 2;

      const flowPosition =
        screenToFlowPosition({
          x:
            centerX +
            (Math.random() - 0.5) *
              200,
          y:
            centerY +
            (Math.random() - 0.5) *
              200,
        });

      const newNode: Node = {
        id: createId(),
        data: {},
        position: flowPosition,
        type: selection.type,
      };

      setNodes((nodes) => {
        const hasInitialTrigger =
          nodes.some(
            (node) =>
              node.type ===
              NodeType.INITIAL
          );

        if (hasInitialTrigger) {
          return [newNode];
        }

        return [
          ...nodes,
          newNode,
        ];
      });

      onOpenChange(false);
      toast.success("Node added");
    },
    [
      setNodes,
      getNodes,
      screenToFlowPosition,
      onOpenChange,
    ]
  );

  const renderNodeOption = (
    nodeType: NodeTypeOption
  ) => {
    const Icon = nodeType.icon;

    return (
      <div
        key={nodeType.type}
        onClick={() =>
          handleNodeSelect(nodeType)
        }
        className="
          w-full
          justify-start
          h-auto
          py-5
          px-4
          rounded-none
          cursor-pointer
          border-l-2
          border-transparent
          hover:border-l-primary
          hover:bg-muted/50
        "
      >
        <div className="flex gap-3">
          <div className="flex items-center justify-center">
            {typeof Icon ===
            "string" ? (
              <Image
                src={Icon}
                alt={nodeType.label}
                width={20}
                height={20}
                className="size-5 object-contain rounded-sm"
              />
            ) : (
              <Icon className="size-5" />
            )}
          </div>

          <div>
            <h4 className="font-medium">
              {nodeType.label}
            </h4>

            <p className="text-sm text-muted-foreground">
              {nodeType.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>
            What triggers this workflow?
          </SheetTitle>

          <SheetDescription>
            A trigger is a step that starts
            your workflow.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {triggerNodes.map(renderNodeOption)}

          <Separator className="my-6" />

          {executionNodes.map(renderNodeOption)}
        </div>
      </SheetContent>
    </Sheet>
  );
}