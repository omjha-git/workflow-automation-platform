"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import {
  useCreateCredential,
  useUpdateCredential,
} from "../hooks/use-credentials";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const credentialTypes = [
  "OPENAI",
  "ANTHROPIC",
  "GEMINI",
  "DISCORD",
  "WHATSAPP",
  "STRIPE",
] as const;

type CredentialTypeValue = (typeof credentialTypes)[number];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(credentialTypes),
  value: z.string().min(1, "Credential value is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CredentialFormProps {
  initialData?: {
    id?: string;
    name: string;
    type: CredentialTypeValue;
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
    defaultValues: initialData ?? {
      name: "",
      type: "GEMINI",
      value: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit && initialData?.id) {
        await updateCredential.mutateAsync({
          id: initialData.id,
          name: values.name,
          type: values.type,
          value: values.value,
        });
      } else {
        await createCredential.mutateAsync({
          name: values.name,
          type: values.type,
          value: values.value,
        });
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
          Add or update credentials used by workflow nodes.
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
                      placeholder="My Gemini API Key"
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
                    disabled={isPending}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select credential type" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="OPENAI">OpenAI</SelectItem>
                      <SelectItem value="ANTHROPIC">
                        Anthropic
                      </SelectItem>
                      <SelectItem value="GEMINI">Gemini</SelectItem>
                      <SelectItem value="DISCORD">Discord</SelectItem>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                      <SelectItem value="STRIPE">Stripe</SelectItem>
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
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter API key, token, or webhook URL"
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