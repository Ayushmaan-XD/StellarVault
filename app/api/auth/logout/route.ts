import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // In a real implementation, you might want to invalidate the token
    // by adding it to a blacklist or using short-lived tokens with refresh tokens

    // For now, we'll just return a success response
    // The actual logout happens on the client by removing the token

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
