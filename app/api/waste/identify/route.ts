import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Item from "@/models/Item"
import Activity from "@/models/Activity"
import { authMiddleware, type AuthRequest } from "@/middleware/auth"

// POST identify waste items
export async function POST(req: AuthRequest) {
  try {
    const authResponse = await authMiddleware(req)
    if (authResponse.status !== 200) {
      return authResponse
    }

    await dbConnect()

    // Find expired items
    const currentDate = new Date()
    const expiredItems = await Item.find({
      expiryDate: { $lt: currentDate },
      isWaste: false,
    })

    // Find items out of uses
    const outOfUsesItems = await Item.find({
      usesLeft: 0,
      isWaste: false,
    })

    // Mark items as waste
    const wasteItems = []

    for (const item of expiredItems) {
      item.isWaste = true
      item.wasteReason = "Expired"
      await item.save()
      wasteItems.push(item)

      // Log activity
      await Activity.create({
        userId: req.user?.userId,
        userName: req.user?.name || "Unknown",
        action: "waste",
        itemId: item.itemId,
        itemName: item.name,
        containerId: item.containerId,
        details: `Marked ${item.name} as waste: Expired`,
      })
    }

    for (const item of outOfUsesItems) {
      item.isWaste = true
      item.wasteReason = "Out of Uses"
      await item.save()
      wasteItems.push(item)

      // Log activity
      await Activity.create({
        userId: req.user?.userId,
        userName: req.user?.name || "Unknown",
        action: "waste",
        itemId: item.itemId,
        itemName: item.name,
        containerId: item.containerId,
        details: `Marked ${item.name} as waste: Out of Uses`,
      })
    }

    return NextResponse.json({
      wasteItems,
      expiredCount: expiredItems.length,
      outOfUsesCount: outOfUsesItems.length,
      totalCount: wasteItems.length,
    })
  } catch (error) {
    console.error("Error identifying waste:", error)
    return NextResponse.json({ error: "Error identifying waste" }, { status: 500 })
  }
}
