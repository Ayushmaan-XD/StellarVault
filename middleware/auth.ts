import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getToken } from "next-auth/jwt"

export interface AuthRequest extends NextRequest {
  user?: {
    userId: string
    name: string
    email: string
    role: string
  }
}

const secret = process.env.JWT_SECRET || "your-secret-key"

export async function authMiddleware(req: AuthRequest) {
  try {
    // First try to get token from NextAuth session
    const session = await getToken({ req, secret })

    if (session) {
      req.user = {
        userId: session.sub as string,
        name: session.name as string,
        email: session.email as string,
        role: (session as any).role || "astronaut",
      }
      return NextResponse.next()
    }

    // If no NextAuth session, try JWT from Authorization header
    const authHeader = req.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication invalid" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    try {
      const payload = jwt.verify(token, secret) as {
        userId: string
        name: string
        email: string
        role: string
      }

      req.user = payload
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json({ error: "Authentication invalid" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Authentication error" }, { status: 500 })
  }
}
