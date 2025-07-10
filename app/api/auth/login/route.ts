import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(req: Request) {
  try {
    // Parse request body with error handling
    let body
    try {
      body = await req.json()
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    // Validate request body
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    const { email, password } = validationResult.data

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error("Error signing in:", authError)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", authData.user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
      return NextResponse.json({ error: "Error fetching user profile" }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: authData.user.id,
        name: profile.name,
        email: authData.user.email,
        role: profile.role,
      },
      token: authData.session.access_token,
    })
  } catch (error: any) {
    console.error("Unhandled login error:", error)
    return NextResponse.json(
      {
        error: "Error logging in",
        details: error.message || String(error),
      },
      { status: 500 },
    )
  }
}
