import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const user = await getUser();

  if (user) {
    redirect("/deals");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8 px-4 bg-gradient-to-b from-background via-background to-muted/30">
      <LoginForm />
    </div>
  );
}

