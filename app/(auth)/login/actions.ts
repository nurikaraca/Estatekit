"use server"

import { redirect } from "next/navigation"

import {
  type AppProfile,
  ensureUserProfile,
  getPostLoginRedirect,
} from "@/lib/supabase/auth"
import { createSupabaseServerClient } from "@/lib/supabase/server"

async function getProfileOrRedirect(user: Parameters<typeof ensureUserProfile>[0]) {
  try {
    return await ensureUserProfile(user)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to prepare your account profile"

    redirect(`/login?error=${encodeURIComponent(message)}`)
  }
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?error=Unable%20to%20read%20signed-in%20user")
  }

  const profile = (await getProfileOrRedirect(user)) as AppProfile

  redirect(getPostLoginRedirect(profile))
}

export async function signUpAction(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    redirect(`/login?mode=signup&error=${encodeURIComponent(error.message)}`)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(
      "/login?message=Check%20your%20email%20to%20confirm%20your%20account"
    )
  }

  const profile = (await getProfileOrRedirect(user)) as AppProfile

  redirect(getPostLoginRedirect(profile))
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient()

  await supabase.auth.signOut()
  redirect("/login")
}
