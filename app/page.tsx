import { redirect } from "next/navigation";
import Dashboard from "@/src/components/dashboard/Dashboard";
import { isAuthenticated } from "@/src/lib/auth";

export default async function Home() {
  if (!(await isAuthenticated())) redirect("/login");
  return <Dashboard />;
}
