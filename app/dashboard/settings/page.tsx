import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import SettingsCard from "./settings-card";
import { Session } from "next-auth";

// client component can not use async
export default async function page() {
  const session = await auth();
  if (!session) redirect("/");
  if (session) return <SettingsCard session={session} />;
}
