import { createClient } from "@supabase/supabase-js"

import { getSupabaseServiceRoleKey, getSupabaseUrl } from "./env"

export function createSupabaseAdminClient() {
  return createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export function tryCreateSupabaseAdminClient() {
  try {
    return {
      supabase: createSupabaseAdminClient(),
      error: null,
    }
  } catch (error) {
    return {
      supabase: null,
      error: error instanceof Error ? error.message : "Missing Supabase admin configuration.",
    }
  }
}
