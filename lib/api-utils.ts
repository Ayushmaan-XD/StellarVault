import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export interface AuthRequest extends NextRequest {
  user?: {
    userId: string
    name: string
    email: string
    role: string
  }
}

export async function authMiddleware(req: AuthRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    // Create a Supabase client with the token
    const supabase = createServerSupabaseClient()

    // Get user from session
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Add user to request
    req.user = {
      userId: user.id,
      name: profile.name,
      email: user.email || "",
      role: profile.role,
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Auth middleware error:", error)
    return NextResponse.json({ error: "Authentication error" }, { status: 500 })
  }
}
