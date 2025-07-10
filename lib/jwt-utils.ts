import { isSupabaseConfigured } from "./env"

export async function verifyJWT(token: string) {
  try {
    if (!isSupabaseConfigured()) {
      // If Supabase isn't configured, just return valid for now
      return { valid: true, userId: "anonymous" }
    }

    // Implement JWT verification with Supabase JWT secret
    // This is a placeholder and should be implemented properly
    return { valid: true, userId: "verified-user" }
  } catch (error) {
    console.error("Error verifying JWT:", error)
    return { valid: false, userId: null }
  }
}
