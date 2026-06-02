"use client";

import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCredentialsParams } from "./use-credentials-params";

type CredentialType = "OPENAI" | "ANTHROPIC" | "GEMINI";



export const useSuspenseCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialsParams();

  return useSuspenseQuery(
    trpc.credentials.getMany.queryOptions(params)
  );
};

export const useCreateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: async (data) => {
        toast.success(`Credential "${data.name}" created`);

        await queryClient.invalidateQueries(
          trpc.credentials.getMany.queryFilter()
        );
      },
      onError: (error) => {
        toast.error(`Failed to create credential: ${error.message}`);
      },
    })
  );
};

export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: async (data) => {
        toast.success(`Credential "${data.name}" removed`);

        await queryClient.invalidateQueries(
          trpc.credentials.getMany.queryFilter()
        );

        await queryClient.invalidateQueries(
          trpc.credentials.getOne.queryFilter({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove credential: ${error.message}`);
      },
    })
  );
};

export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.credentials.getOne.queryOptions({ id })
  );
};

export const useUpdateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: async (data) => {
        toast.success(`Credential "${data.name}" saved`);

        await queryClient.invalidateQueries(
          trpc.credentials.getMany.queryFilter()
        );

        await queryClient.invalidateQueries(
          trpc.credentials.getOne.queryFilter({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to save credential: ${error.message}`);
      },
    })
  );
};

export const useCredentialsByType = (
  type: CredentialType
) => {
  const trpc = useTRPC();

  return useQuery(
    trpc.credentials.getByType.queryOptions({
      type,
    })
  );
};