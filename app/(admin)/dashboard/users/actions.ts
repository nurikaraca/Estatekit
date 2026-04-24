"use server"

import { revalidatePath } from "next/cache"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/supabase/auth"

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

export async function updateUserRoleAction(formData: FormData) {
  await requireAdmin()

  const userId = getString(formData, "userId")
  const role = getString(formData, "role")

  if (!["admin", "user"].includes(role)) {
    throw new Error("Invalid role.")
  }

  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/users")
}
