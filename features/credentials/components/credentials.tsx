"use client";

import React from "react";
import { useRouter } from "next/navigation";

import {
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntitySearch,
  ErrorView,
  LoadingView,
  EmptyView,
} from "@/features/workflows/components/entity-components";

import {
  useSuspenseCredentials,
  useRemoveCredential,
} from "../hooks/use-credentials";

import { useCredentialsParams } from "../hooks/use-credentials-params";

type Credential = {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

type CredentialsResult = {
  items: Credential[];
  total: number;
  totalPages: number;
};

export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();

  return (
    <EntitySearch
      value={params.search}
      onChange={(search: string) =>
        setParams({
          ...params,
          search,
          page: 1,
        })
      }
      placeholder="Search credentials"
    />
  );
};

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();
  const data = credentials.data as unknown as CredentialsResult;

  return (
    <EntityList
      items={data.items}
      getKey={(credential: Credential) => credential.id}
      renderItem={(credential: Credential) => (
        <CredentialItem data={credential} />
      )}
      emptyView={<CredentialsEmpty />}
    />
  );
};

export const CredentialsHeader = ({
  disabled,
}: {
  disabled?: boolean;
}) => {
  const router = useRouter();

  return (
    <EntityHeader
      title="Credentials"
      description="Create and manage your credentials"
      onNew={() => router.push("/credentials/new")}
      newButtonLabel="New credential"
      disabled={disabled}
      isCreating={false}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView message="Loading credentials..." />;
};

export const CredentialsError = () => {
  return <ErrorView message="Error loading credentials" />;
};

export const CredentialsEmpty = () => {
  const router = useRouter();

  return (
    <EmptyView
      onNew={() => router.push("/credentials/new")}
      message="You haven't created any credentials yet. Get started by creating your first credential"
    />
  );
};

export const CredentialItem = ({
  data,
}: {
  data: Credential;
}) => {
  const removeCredential = useRemoveCredential();

  return (
    <EntityItem
      title={data.name}
      subtitle={data.type}
      href={`/credentials/${data.id}`}
      onRemove={() => removeCredential.mutate({ id: data.id })}
    />
  );
};