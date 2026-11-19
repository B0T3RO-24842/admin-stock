import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Login } from "./components";

export default async function AppPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  return <Login />;
}
