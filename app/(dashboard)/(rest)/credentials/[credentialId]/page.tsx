import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { CredentialForm } from "@/features/credentials/components/credential";

type Props = {
  params: Promise<{
    credentialId: string;
  }>;
};

const Page = async ({ params }: Props) => {
  await requireAuth();

  const { credentialId } = await params;

  const credential = await prisma.credential.findUnique({
    where: {
      id: credentialId,
    },
  });

  if (!credential) {
    notFound();
  }

  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full">
        <CredentialForm
  initialData={{
    id: credential.id,
    name: credential.name,
    type: credential.type as "GEMINI" | "DISCORD" | "WHATSAPP" | "STRIPE",
    value: credential.value,
  }}
/>
      </div>
    </div>
  );
};

export default Page;