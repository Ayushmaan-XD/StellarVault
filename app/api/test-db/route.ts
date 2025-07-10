import { NextResponse } from "next/server"
import { testConnection } from "@/lib/mongodb"

export async function GET() {
  try {
    const result = await testConnection()

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error testing database connection",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
