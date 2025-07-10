import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { validateEnv, isSupabaseConfigured } from "./env"

// Get environment variables
const env = validateEnv()

// Create a mock Supabase client when environment variables aren't set
const createMockClient = () => {
  console.warn("Supabase environment variables not set. Using mock client.")

  // Return a mock client that doesn't throw errors but doesn't do anything
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signUp: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signIn: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: new Error("Supabase not configured") }),
      update: () => ({ data: null, error: new Error("Supabase not configured") }),
      delete: () => ({ data: null, error: new Error("Supabase not configured") }),
    }),
  } as any
}

// Create Supabase clients only if environment variables are set
export const supabase = isSupabaseConfigured()
  ? createClient<Database>(env.supabase.url, env.supabase.anonKey)
  : createMockClient()

export const supabaseAdmin = isSupabaseConfigured()
  ? createClient<Database>(env.supabase.url, env.supabase.serviceRoleKey)
  : createMockClient()

// Create a server-side client (to be used in server components and API routes)
export const createServerSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    return createMockClient()
  }

  return createClient<Database>(env.supabase.url, env.supabase.anonKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Create a client-side client (to be used in client components)
export const createClientSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    return createMockClient()
  }

  return createClient<Database>(env.supabase.url, env.supabase.anonKey)
}
