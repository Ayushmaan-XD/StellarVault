import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { authMiddleware, type AuthRequest } from "@/lib/api-utils"
import { z } from "zod"

const coordinatesSchema = z.object({
  width: z.number().min(0),
  depth: z.number().min(0),
  height: z.number().min(0),
})

const positionSchema = z.object({
  startCoordinates: coordinatesSchema,
  endCoordinates: coordinatesSchema,
})

const itemSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  name: z.string().min(1, "Name is required"),
  width: z.number().min(0, "Width must be positive"),
  depth: z.number().min(0, "Depth must be positive"),
  height: z.number().min(0, "Height must be positive"),
  mass: z.number().min(0, "Mass must be positive"),
  priority: z.number().min(0, "Priority must be between 0 and 100").max(100, "Priority must be between 0 and 100"),
  expiryDate: z.string().nullable().optional(),
  usageLimit: z.number().min(0, "Usage limit must be positive"),
  usesLeft: z.number().min(0, "Uses left must be positive"),
  preferredZone: z.string().min(1, "Preferred zone is required"),
  containerId: z.string().min(1, "Container ID is required"),
  position: positionSchema.nullable().optional(),
})

// GET all items
export async function GET(req: AuthRequest) {
  try {
    const authResponse = await authMiddleware(req)
    if (authResponse.status !== 200) {
      return authResponse
    }

    const supabase = createServerSupabaseClient()

    const { searchParams } = new URL(req.url)
    const containerId = searchParams.get("containerId")
    const isWaste = searchParams.get("isWaste")

    let query = supabase.from("items").select("*")

    if (containerId) {
      query = query.eq("containerId", containerId)
    }

    if (isWaste) {
      query = query.eq("isWaste", isWaste === "true")
    }

    // Order by priority descending
    query = query.order("priority", { ascending: false })

    const { data: items, error } = await query

    if (error) {
      console.error("Error fetching items:", error)
      return NextResponse.json({ error: "Error fetching items" }, { status: 500 })
    }

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json({ error: "Error fetching items" }, { status: 500 })
  }
}

// POST new item
export async function POST(req: AuthRequest) {
  try {
    const authResponse = await authMiddleware(req)
    if (authResponse.status !== 200) {
      return authResponse
    }

    const supabase = createServerSupabaseClient()

    const body = await req.json()

    // Validate request body
    const validationResult = itemSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    const itemData = validationResult.data

    // Check if item ID already exists
    const { data: existingItem, error: checkError } = await supabase
      .from("items")
      .select("itemId")
      .eq("itemId", itemData.itemId)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing item:", checkError)
      return NextResponse.json({ error: "Error checking existing item" }, { status: 500 })
    }

    if (existingItem) {
      return NextResponse.json({ error: "Item ID already exists" }, { status: 400 })
    }

    // Check if container exists
    const { data: container, error: containerError } = await supabase
      .from("containers")
      .select("*")
      .eq("containerId", itemData.containerId)
      .maybeSingle()

    if (containerError) {
      console.error("Error checking container:", containerError)
      return NextResponse.json({ error: "Error checking container" }, { status: 500 })
    }

    if (!container) {
      return NextResponse.json({ error: "Container not found" }, { status: 404 })
    }

    // Create new item
    const { data: item, error: insertError } = await supabase
      .from("items")
      .insert({
        ...itemData,
        expiryDate: itemData.expiryDate ? new Date(itemData.expiryDate).toISOString() : null,
        createdBy: req.user?.userId,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating item:", insertError)
      return NextResponse.json({ error: "Error creating item" }, { status: 500 })
    }

    // Update container
    const itemVolume = itemData.width * itemData.depth * itemData.height
    const containerVolume = container.width * container.depth * container.height
    const volumePercentage = (itemVolume / containerVolume) * 100

    const { error: updateError } = await supabase
      .from("containers")
      .update({
        currentWeight: container.currentWeight + itemData.mass,
        itemCount: container.itemCount + 1,
        utilization: container.utilization + volumePercentage,
      })
      .eq("containerId", container.containerId)

    if (updateError) {
      console.error("Error updating container:", updateError)
      // We don't want to fail the request if the container update fails
      // The item has been created successfully
    }

    // Log activity
    const { error: activityError } = await supabase.from("activities").insert({
      userId: req.user?.userId,
      userName: req.user?.name || "Unknown",
      action: "add",
      itemId: item.itemId,
      itemName: item.name,
      containerId: container.containerId,
      details: `Added ${item.name} to ${container.containerId}`,
    })

    if (activityError) {
      console.error("Error logging activity:", activityError)
      // We don't want to fail the request if the activity logging fails
    }

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json({ error: "Error creating item" }, { status: 500 })
  }
}
