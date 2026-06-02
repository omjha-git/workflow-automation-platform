import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async() => {
  await requireUnAuth();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <RegisterForm />
    </div>
  );
};

export default Page;