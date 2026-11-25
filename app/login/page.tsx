import { redirect } from "next/navigation";
import LoginForm from "@/src/components/auth/LoginForm";
import { isAuthenticated } from "@/src/lib/auth";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/");
  return <LoginForm />;
}
