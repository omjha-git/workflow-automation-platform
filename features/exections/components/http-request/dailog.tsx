"use client";

import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  FormDescription,
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

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, {
      message: "Variable name is required",
    })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
    }),

  endpoint: z.string().url({
    message: "Please enter a valid URL",
  }),

  method: z.enum([
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ]),

  body: z.string().optional(),
});

export type HttpRequestFormValues = z.infer<
  typeof formSchema
>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    values: HttpRequestFormValues
  ) => void;

  defaultValues?: Partial<HttpRequestFormValues>;
}

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<HttpRequestFormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      variableName:
        defaultValues.variableName || "",

      endpoint: defaultValues.endpoint || "",

      method:
        defaultValues.method || "GET",

      body: defaultValues.body || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName:
          defaultValues.variableName || "",

        endpoint:
          defaultValues.endpoint || "",

        method:
          defaultValues.method || "GET",

        body: defaultValues.body || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName =
    form.watch("variableName");

  const watchMethod = form.watch("method");

  const showBodyField = [
    "POST",
    "PUT",
    "PATCH",
  ].includes(watchMethod);

  const handleSubmit = (
    values: z.infer<typeof formSchema>
  ) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            HTTP Request
          </DialogTitle>

          <DialogDescription>
            Configure settings for the HTTP
            Request node.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              handleSubmit
            )}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Variable Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="myApiCall"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    Use this name to
                    reference the result in
                    other nodes:{" "}
                    {`{{${watchVariableName}.httpResponse.data}}`}
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Endpoint
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="https://api.example.com/users"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Method
                  </FormLabel>

                  <Select
                    value={field.value}
                    onValueChange={
                      field.onChange
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="GET">
                        GET
                      </SelectItem>

                      <SelectItem value="POST">
                        POST
                      </SelectItem>

                      <SelectItem value="PUT">
                        PUT
                      </SelectItem>

                      <SelectItem value="PATCH">
                        PATCH
                      </SelectItem>

                      <SelectItem value="DELETE">
                        DELETE
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {showBodyField && (
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Body
                    </FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder='{"name":"John"}'
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(false)
                }
              >
                Cancel
              </Button>

              <Button type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};