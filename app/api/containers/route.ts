import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Container from "@/models/Container"
import { z } from "zod"
import jwt from "jsonwebtoken"

const containerSchema = z.object({
  containerId: z.string().min(1, "Container ID is required"),
  zone: z.string().min(1, "Zone is required"),
  width: z.number().min(0, "Width must be positive"),
  depth: z.number().min(0, "Depth must be positive"),
  height: z.number().min(0, "Height must be positive"),
  maxWeight: z.number().min(0, "Maximum weight must be positive"),
})

// Helper function to verify JWT token
async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, error: "Unauthorized" }
  }

  const token = authHeader.substring(7)

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    return { valid: false, error: "Server configuration error" }
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: string }
    return { valid: true, userId: decoded.userId }
  } catch (error) {
    return { valid: false, error: "Invalid token" }
  }
}

// GET all containers
export async function GET(req: NextRequest) {
  try {
    // Verify token
    const tokenResult = await verifyToken(req)
    if (!tokenResult.valid) {
      return NextResponse.json({ error: tokenResult.error }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(req.url)
    const zone = searchParams.get("zone")
    const query: any = {}

    if (zone) {
      query.zone = zone
    }

    const containers = await Container.find(query)

    return NextResponse.json({ containers })
  } catch (error) {
    console.error("Error fetching containers:", error)
    return NextResponse.json({ error: "Error fetching containers" }, { status: 500 })
  }
}

// POST new container
export async function POST(req: NextRequest) {
  try {
    // Verify token
    const tokenResult = await verifyToken(req)
    if (!tokenResult.valid) {
      return NextResponse.json({ error: tokenResult.error }, { status: 401 })
    }

    await dbConnect()

    const body = await req.json()

    // Validate request body
    const validationResult = containerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    const containerData = validationResult.data

    // Check if container ID already exists
    const existingContainer = await Container.findOne({ containerId: containerData.containerId })
    if (existingContainer) {
      return NextResponse.json({ error: "Container ID already exists" }, { status: 400 })
    }

    // Create new container
    const container = await Container.create({
      ...containerData,
      createdBy: tokenResult.userId,
      currentWeight: 0,
      itemCount: 0,
      utilization: 0,
    })

    return NextResponse.json({ container }, { status: 201 })
  } catch (error) {
    console.error("Error creating container:", error)
    return NextResponse.json({ error: "Error creating container" }, { status: 500 })
  }
}
