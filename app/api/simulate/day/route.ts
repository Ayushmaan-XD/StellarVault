import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Item from "@/models/Item"
import Activity from "@/models/Activity"
import { authMiddleware, type AuthRequest } from "@/middleware/auth"
import { z } from "zod"

const simulationSchema = z.object({
  numOfDays: z.number().min(1, "Number of days must be at least 1"),
  itemsToBeUsedPerDay: z.array(
    z.object({
      itemId: z.string().min(1, "Item ID is required"),
      usesPerDay: z.number().min(1, "Uses per day must be at least 1").default(1),
    }),
  ),
})

// POST simulate days
export async function POST(req: AuthRequest) {
  try {
    const authResponse = await authMiddleware(req)
    if (authResponse.status !== 200) {
      return authResponse
    }

    await dbConnect()

    const body = await req.json()

    // Validate request body
    const validationResult = simulationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    const { numOfDays, itemsToBeUsedPerDay } = validationResult.data

    // Calculate new date
    const currentDate = new Date()
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + numOfDays)

    // Process items
    const itemsUsed = []
    const itemsExpired = []
    const itemsDepletedToday = []

    for (const itemUsage of itemsToBeUsedPerDay) {
      const item = await Item.findOne({ itemId: itemUsage.itemId })

      if (!item) {
        continue
      }

      const totalUses = itemUsage.usesPerDay * numOfDays
      const remainingUses = Math.max(0, item.usesLeft - totalUses)
      const wasDepletedToday = item.usesLeft > 0 && remainingUses === 0

      item.usesLeft = remainingUses

      if (remainingUses === 0 && !item.isWaste) {
        item.isWaste = true
        item.wasteReason = "Out of Uses"
        itemsDepletedToday.push({
          itemId: item.itemId,
          name: item.name,
        })
      }

      await item.save()

      itemsUsed.push({
        itemId: item.itemId,
        name: item.name,
        usesUsed: totalUses,
        remainingUses,
      })

      // Log activity
      await Activity.create({
        userId: req.user?.userId,
        userName: req.user?.name || "Unknown",
        action: "update",
        itemId: item.itemId,
        itemName: item.name,
        containerId: item.containerId,
        details: `Used ${item.name} ${totalUses} times in simulation`,
      })
    }

    // Find newly expired items
    const expiredItems = await Item.find({
      expiryDate: { $gt: currentDate, $lte: newDate },
      isWaste: false,
    })

    for (const item of expiredItems) {
      item.isWaste = true
      item.wasteReason = "Expired"
      await item.save()

      itemsExpired.push({
        itemId: item.itemId,
        name: item.name,
        expiryDate: item.expiryDate,
      })

      // Log activity
      await Activity.create({
        userId: req.user?.userId,
        userName: req.user?.name || "Unknown",
        action: "waste",
        itemId: item.itemId,
        itemName: item.name,
        containerId: item.containerId,
        details: `Marked ${item.name} as waste: Expired in simulation`,
      })
    }

    return NextResponse.json({
      success: true,
      newDate,
      changes: {
        itemsUsed,
        itemsExpired,
        itemsDepletedToday,
      },
    })
  } catch (error) {
    console.error("Error simulating days:", error)
    return NextResponse.json({ error: "Error simulating days" }, { status: 500 })
  }
}
