import "server-only";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";

export async function verifyAdminSession() {
  const session = await getAdminSession();

  if (!session?.admin) {
    redirect("/admin/login");
  }

  return session;
}
