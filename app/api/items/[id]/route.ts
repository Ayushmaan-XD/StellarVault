import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Item from "@/models/Item"
import Container from "@/models/Container"
import Activity from "@/models/Activity"
import { authMiddleware, type AuthRequest } from "@/middleware/auth"
import { z } from "zod"

const updateItemSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  width: z.number().min(0, "Width must be positive").optional(),
  depth: z.number().min(0, "Depth must be positive").optional(),
  height: z.number().min(0, "Height must be positive").optional(),
  mass: z.number().min(0, "Mass must be positive").optional(),
  priority: z
    .number()
    .min(0, "Priority must be between 0 and 100")
    .max(100, "Priority must be between 0 and 100")
    .optional(),
  expiryDate: z.string().nullable().optional(),
  usageLimit: z.number().min(0, "Usage limit must be positive").optional(),
  usesLeft: z.number().min(0, "Uses left must be positive").optional(),
  preferredZone: z.string().min(1, "Preferred zone is required").optional(),
  containerId: z.string().min(1, "Container ID is required").optional(),
  position: z
    .object({
      startCoordinates: z.object({
        width: z.number().min(0),
        depth: z.number().min(0),
        height: z.number().min(0),
      }),
      endCoordinates: z.object({
        width: z.number().min(0),
        depth: z.number().min(0),
        height: z.number().min(0),
      }),
    })
    .nullable()
    .optional(),
  isWaste: z.boolean().optional(),
  wasteReason: z.enum(["Expired", "Out of Uses", "Damaged", null]).optional(),
})

// GET item by ID
export async function GET(req: AuthRequest, { params }: { params: { id: string } }) {
  try {
    const authResponse = await authMiddleware(req)
    if (authResponse.status !== 200) {
      return authResponse
    }

    await dbConnect()

    const item = await Item.findOne({ itemId: params.id })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ item })
  } catch (error) {
    console.error("Error fetching item:", error)
    return NextResponse.json({ error: "Error fetching item" }, { status: 500 })
  }
}

// PUT update item
export async function PUT(req: AuthRequest, { params }: { params: { id: string } }) {
  try {
    const authResponse = await authMiddleware(req)
    if (authResponse.status !== 200) {
      return authResponse
    }

    await dbConnect()

    const body = await req.json()

    // Validate request body
    const validationResult = updateItemSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    const updateData = validationResult.data

    // Find item
    const item = await Item.findOne({ itemId: params.id })
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // If container is being changed, update both containers
    if (updateData.containerId && updateData.containerId !== item.containerId) {
      // Check if new container exists
      const newContainer = await Container.findOne({ containerId: updateData.containerId })
      if (!newContainer) {
        return NextResponse.json({ error: "New container not found" }, { status: 404 })
      }

      // Update old container
      const oldContainer = await Container.findOne({ containerId: item.containerId })
      if (oldContainer) {
        const itemVolume = item.width * item.depth * item.height
        const containerVolume = oldContainer.width * oldContainer.depth * oldContainer.height
        const volumePercentage = (itemVolume / containerVolume) * 100

        oldContainer.currentWeight -= item.mass
        oldContainer.itemCount -= 1
        oldContainer.utilization -= volumePercentage
        await oldContainer.save()
      }

      // Update new container
      const newItemVolume =
        (updateData.width || item.width) * (updateData.depth || item.depth) * (updateData.height || item.height)
      const newContainerVolume = newContainer.width * newContainer.depth * newContainer.height
      const newVolumePercentage = (newItemVolume / newContainerVolume) * 100

      newContainer.currentWeight += updateData.mass || item.mass
      newContainer.itemCount += 1
      newContainer.utilization += newVolumePercentage
      await newContainer.save()

      // Log activity
      await Activity.create({
        userId: req.user?.userId,
        userName: req.user?.name || "Unknown",
        action: "move",
        itemId: item.itemId,
        itemName: item.name,
        containerId: newContainer.containerId,
        details: `Moved ${item.name} from ${item.containerId} to ${newContainer.containerId}`,
      })
    }

    // If item is being marked as waste
    if (updateData.isWaste && !item.isWaste) {
      await Activity.create({
        userId: req.user?.userId,
        userName: req.user?.name || "Unknown",
        action: "waste",
        itemId: item.itemId,
        itemName: item.name,
        containerId: item.containerId,
        details: `Marked ${item.name} as waste: ${updateData.wasteReason || "No reason provided"}`,
      })
    }

    // Update item
    if (updateData.expiryDate) {
      updateData.expiryDate = new Date(updateData.expiryDate)
    }

    const updatedItem = await Item.findOneAndUpdate({ itemId: params.id }, updateData, {
      new: true,
      runValidators: true,
    })

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error("Error updating item:", error)
    return NextResponse.json({ error: "Error updating item" }, { status: 500 })
  }
}

// DELETE item
export async function DELETE(req: AuthRequest, { params }: { params: { id: string } }) {
  try {
    const authResponse = await authMiddleware(req)
    if (authResponse.status !== 200) {
      return authResponse
    }

    await dbConnect()

    // Find item
    const item = await Item.findOne({ itemId: params.id })
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Update container
    const container = await Container.findOne({ containerId: item.containerId })
    if (container) {
      const itemVolume = item.width * item.depth * item.height
      const containerVolume = container.width * container.depth * container.height
      const volumePercentage = (itemVolume / containerVolume) * 100

      container.currentWeight -= item.mass
      container.itemCount -= 1
      container.utilization -= volumePercentage
      await container.save()
    }

    // Log activity
    await Activity.create({
      userId: req.user?.userId,
      userName: req.user?.name || "Unknown",
      action: "remove",
      itemId: item.itemId,
      itemName: item.name,
      containerId: item.containerId,
      details: `Removed ${item.name} from ${item.containerId}`,
    })

    // Delete item
    await Item.findOneAndDelete({ itemId: params.id })

    return NextResponse.json({ message: "Item deleted successfully" })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 })
  }
}
