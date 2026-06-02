import Image from "next/image";
import Link from "next/link";


import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnAuth();

  return (
    <div className="bg-muted flex min-h-svh flex-col justify-center gap-6 p-6 md:p-10">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">

        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image
            src="/logos/logo.svg"
            alt="Nodebase"
            width={30}
            height={30}
          />

          <span className="text-xl font-bold">
            Nodebase
          </span>
        </Link>

        <LoginForm />
      </div>
    </div>
  );
};

export default Page;