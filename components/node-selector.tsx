"use client";

import { nanoid } from "nanoid";
import {
  BotIcon,
  FileTextIcon,
  GlobeIcon,
  MousePointerClickIcon,
  SendIcon,
  SparklesIcon,
  MessageCircleIcon,
  CreditCardIcon,
} from "lucide-react";
import { useSetAtom } from "jotai";
import type { Node } from "@xyflow/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { editorAtom } from "@/features/editor/store/atoms";

const NodeType = {
  MANUAL_TRIGGER: "MANUAL_TRIGGER",
  GOOGLE_FORM_TRIGGER: "GOOGLE_FORM_TRIGGER",
  STRIPE_TRIGGER: "STRIPE_TRIGGER",
  HTTP_REQUEST: "HTTP_REQUEST",
  GEMINI: "GEMINI",
  DISCORD: "DISCORD",
  WHATSAPP: "WHATSAPP",
} as const;

type NodeTypeValue =
  (typeof NodeType)[keyof typeof NodeType];

type NodeOption = {
  type: NodeTypeValue;
  name: string;
  description: string;
  icon: React.ElementType;
};

const nodeOptions: NodeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    name: "Manual Trigger",
    description: "Run workflow manually",
    icon: MousePointerClickIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    name: "Google Form",
    description: "Trigger when form is submitted",
    icon: FileTextIcon,
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    name: "Stripe",
    description: "Trigger from Stripe event",
    icon: CreditCardIcon,
  },
  {
    type: NodeType.HTTP_REQUEST,
    name: "HTTP Request",
    description: "Send API request",
    icon: GlobeIcon,
  },
  {
    type: NodeType.GEMINI,
    name: "Gemini",
    description: "Generate AI response",
    icon: SparklesIcon,
  },
  {
    type: NodeType.DISCORD,
    name: "Discord",
    description: "Send Discord message",
    icon: SendIcon,
  },
  {
    type: NodeType.WHATSAPP,
    name: "WhatsApp",
    description: "Send WhatsApp message",
    icon: MessageCircleIcon,
  },
];

type NodeSelectorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const NodeSelector = ({
  open,
  onOpenChange,
}: NodeSelectorProps) => {
  const setEditor = useSetAtom(editorAtom);

  const handleAddNode = (type: NodeTypeValue) => {
    const newNode: Node = {
      id: nanoid(),
      type,
      position: {
        x: Math.random() * 300,
        y: Math.random() * 300,
      },
      data: {},
    };

    setEditor((editor) => {
      if (!editor) return editor;

      editor.addNodes(newNode);
      return editor;
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Node</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          {nodeOptions.map((option) => {
            const Icon = option.icon;

            return (
              <Card
                key={option.type}
                className="cursor-pointer transition hover:bg-muted"
                onClick={() => handleAddNode(option.type)}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                    <Icon className="size-5" />
                  </div>

                  <div>
                    <p className="font-medium">{option.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};