import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { z } from "zod"

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "astronaut", "ground-control"]).optional(),
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
    const validationResult = userSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    const { name, email, password, role = "astronaut" } = validationResult.data

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    })

    if (authError) {
      console.error("Error creating user in Supabase Auth:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create profile in profiles table
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        user_id: authData.user.id,
        name,
        role,
      })
      .select()
      .single()

    if (profileError) {
      console.error("Error creating profile:", profileError)
      // Try to delete the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json(
      {
        user: {
          id: authData.user.id,
          name,
          email,
          role,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Unhandled registration error:", error)
    return NextResponse.json(
      {
        error: "Error registering user",
        details: error.message || String(error),
      },
      { status: 500 },
    )
  }
}
