import { redirect } from "next/navigation"
import type { User } from "@supabase/supabase-js"

import { tryCreateSupabaseAdminClient } from "./admin"
import { createSupabaseServerClient } from "./server"

export type AppRole = "admin" | "user"

export type AppProfile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: AppRole
  created_at: string
}

function getFullName(user: User) {
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    null
  )
}

export async function ensureUserProfile(user: User) {
  if (!user.email) {
    throw new Error("Authenticated user is missing an email address.")
  }

  const supabase = await createSupabaseServerClient()
  const { data: profileFromSession, error: sessionLookupError } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, role, created_at")
    .eq("id", user.id)
    .maybeSingle()

  if (sessionLookupError) {
    throw new Error(sessionLookupError.message)
  }

  if (profileFromSession) {
    return profileFromSession as AppProfile
  }

  const { data: createdProfileFromSession, error: sessionCreateError } =
    await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        full_name: getFullName(user),
        avatar_url: user.user_metadata?.avatar_url ?? null,
        role: "user",
      })
      .select("id, email, full_name, avatar_url, role, created_at")
      .single()

  if (!sessionCreateError && createdProfileFromSession) {
    return createdProfileFromSession as AppProfile
  }

  const { supabase: admin, error: adminConfigError } =
    tryCreateSupabaseAdminClient()

  if (!admin) {
    throw new Error(
      `${adminConfigError}. Also failed to create the profile with the active session: ${sessionCreateError?.message}`
    )
  }

  const { data: existingProfile, error: lookupError } = await admin
    .from("profiles")
    .select("id, email, full_name, avatar_url, role, created_at")
    .eq("id", user.id)
    .maybeSingle()

  if (lookupError) {
    throw new Error(lookupError.message)
  }

  if (!existingProfile) {
    const { data: createdProfile, error } = await admin
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        full_name: getFullName(user),
        avatar_url: user.user_metadata?.avatar_url ?? null,
        role: "user",
      })
      .select("id, email, full_name, avatar_url, role, created_at")
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return createdProfile as AppProfile
  }

  return existingProfile as AppProfile
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function getCurrentProfile() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return ensureUserProfile(user)
}

export async function getCurrentAdmin() {
  const profile = await getCurrentProfile()

  if (profile?.role !== "admin") {
    return null
  }

  return profile
}

export async function requireAdmin() {
  const profile = await getCurrentAdmin()

  if (!profile) {
    redirect("/login")
  }

  return profile
}

export function getPostLoginRedirect(profile: AppProfile) {
  return profile.role === "admin" ? "/dashboard" : "/properties"
}
