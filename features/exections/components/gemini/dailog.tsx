"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  credentialId: z.string().min(1, "Credential is required"),
  prompt: z.string().min(1, "Prompt is required"),
  variableName: z.string().min(1, "Variable name is required"),
});

export type GeminiFormValues = z.infer<typeof formSchema>;

type GeminiDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<GeminiFormValues>;
  onSubmit: (values: GeminiFormValues) => void;
};

type CredentialOption = {
  id: string;
  name: string;
  type?: string;
};

export const GeminiDialog = ({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
}: GeminiDialogProps) => {
  const {
    data: credentials = [],
    isLoading: isLoadingCredentials,
  } = useCredentialsByType("GEMINI");

  const form = useForm<GeminiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      credentialId: defaultValues?.credentialId ?? "",
      prompt: defaultValues?.prompt ?? "",
      variableName: defaultValues?.variableName ?? "gemini",
    },
  });

  const handleSubmit = (values: GeminiFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gemini</DialogTitle>
          <DialogDescription>
            Configure Gemini AI prompt and credential.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential</FormLabel>
                  <Select
                    disabled={isLoadingCredentials}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Gemini credential" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {(credentials as CredentialOption[]).map(
                        (credential) => (
                          <SelectItem
                            key={credential.id}
                            value={credential.id}
                          >
                            <div className="flex items-center gap-2">
                              <Image
                                src="/logos/gemini.svg"
                                alt="Gemini"
                                width={16}
                                height={16}
                              />
                              {credential.name}
                            </div>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Example: Solve 125 × 48 and explain shortly."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="gemini" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};