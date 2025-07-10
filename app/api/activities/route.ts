import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Activity from "@/models/Activity"
import { authMiddleware, type AuthRequest } from "@/middleware/auth"

// GET all activities
export async function GET(req: AuthRequest) {
  try {
    const authResponse = await authMiddleware(req)
    if (authResponse.status !== 200) {
      return authResponse
    }

    await dbConnect()

    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const userId = searchParams.get("userId")
    const itemId = searchParams.get("itemId")
    const containerId = searchParams.get("containerId")
    const action = searchParams.get("action")

    const query: any = {}

    if (userId) query.userId = userId
    if (itemId) query.itemId = itemId
    if (containerId) query.containerId = containerId
    if (action) query.action = action

    const skip = (page - 1) * limit

    const activities = await Activity.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit)

    const total = await Activity.countDocuments(query)

    return NextResponse.json({
      activities,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Error fetching activities" }, { status: 500 })
  }
}
