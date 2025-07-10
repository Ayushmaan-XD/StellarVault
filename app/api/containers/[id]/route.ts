import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Container from "@/models/Container"
import Item from "@/models/Item"
import { authMiddleware, type AuthRequest } from "@/middleware/auth"
import { z } from "zod"

const updateContainerSchema = z.object({
  zone: z.string().min(1, "Zone is required").optional(),
  width: z.number().min(0, "Width must be positive").optional(),
  depth: z.number().min(0, "Depth must be positive").optional(),
  height: z.number().min(0, "Height must be positive").optional(),
  maxWeight: z.number().min(0, "Maximum weight must be positive").optional(),
})

// GET container by ID
export async function GET(req: AuthRequest, { params }: { params: { id: string } }) {
  try {
    const authResponse = await authMiddleware(req)
    if (authResponse.status !== 200) {
      return authResponse
    }

    await dbConnect()

    const container = await Container.findOne({ containerId: params.id })

    if (!container) {
      return NextResponse.json({ error: "Container not found" }, { status: 404 })
    }

    // Get items in container
    const items = await Item.find({ containerId: params.id })

    return NextResponse.json({ container, items })
  } catch (error) {
    console.error("Error fetching container:", error)
    return NextResponse.json({ error: "Error fetching container" }, { status: 500 })
  }
}

// PUT update container
export async function PUT(req: AuthRequest, { params }: { params: { id: string } }) {
  try {
    const authResponse = await authMiddleware(req)
    if (authResponse.status !== 200) {
      return authResponse
    }

    await dbConnect()

    const body = await req.json()

    // Validate request body
    const validationResult = updateContainerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    const updateData = validationResult.data

    // Find container
    const container = await Container.findOne({ containerId: params.id })
    if (!container) {
      return NextResponse.json({ error: "Container not found" }, { status: 404 })
    }

    // Update container
    const updatedContainer = await Container.findOneAndUpdate({ containerId: params.id }, updateData, {
      new: true,
      runValidators: true,
    })

    return NextResponse.json({ container: updatedContainer })
  } catch (error) {
    console.error("Error updating container:", error)
    return NextResponse.json({ error: "Error updating container" }, { status: 500 })
  }
}

// DELETE container
export async function DELETE(req: AuthRequest, { params }: { params: { id: string } }) {
  try {
    const authResponse = await authMiddleware(req)
    if (authResponse.status !== 200) {
      return authResponse
    }

    await dbConnect()

    // Check if container has items
    const itemCount = await Item.countDocuments({ containerId: params.id })
    if (itemCount > 0) {
      return NextResponse.json({ error: "Cannot delete container with items. Move items first." }, { status: 400 })
    }

    // Delete container
    const container = await Container.findOneAndDelete({ containerId: params.id })

    if (!container) {
      return NextResponse.json({ error: "Container not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Container deleted successfully" })
  } catch (error) {
    console.error("Error deleting container:", error)
    return NextResponse.json({ error: "Error deleting container" }, { status: 500 })
  }
}
