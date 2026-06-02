"use client";

import { CredentialType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import {
  useCreateCredential,
  useUpdateCredential,
} from "../hooks/use-credentials";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(CredentialType),
  value: z.string().min(1, "API key is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CredentialFormProps {
  initialData?: {
    id?: string;
    name: string;
    type: CredentialType;
    value: string;
  };
}

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
  const router = useRouter();

  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();

  const isEdit = !!initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialType.GEMINI,
      value: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit && initialData?.id) {
        await updateCredential.mutateAsync({
          id: initialData.id,
          ...values,
        });
      } else {
        await createCredential.mutateAsync(values);
      }

      router.push("/credentials");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const isPending =
    createCredential.isPending || updateCredential.isPending;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>
          {isEdit ? "Edit Credential" : "Create Credential"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Update your Gemini API key"
            : "Add your Gemini API key to your account"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Gemini API Key"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select credential type" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value={CredentialType.GEMINI}>
                        Gemini
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gemini API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter Gemini API key"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} type="submit">
              {isEdit ? "Save changes" : "Create credential"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};