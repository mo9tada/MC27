"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { createAdminSession } from "@/lib/session";

export type AdminLoginState = { error?: string } | undefined;

export async function adminLogin(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";

  const isValid = hash ? await bcrypt.compare(password, hash) : false;

  if (!isValid) {
    return { error: "Incorrect password." };
  }

  await createAdminSession();
  redirect("/admin");
}
