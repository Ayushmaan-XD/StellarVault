import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    // Verify token
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as { userId: string }

      // Connect to database
      await dbConnect()

      // Find user
      const user = await User.findById(decoded.userId).select("-password")

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Return user data
      return NextResponse.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
