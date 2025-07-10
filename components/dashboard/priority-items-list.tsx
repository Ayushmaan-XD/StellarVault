"use client"

import { useEffect, useState } from "react"
import { Package } from "lucide-react"
import { getMockData } from "@/lib/mock-data"

interface PriorityItem {
  itemId: string
  name: string
  priority: number
  zone: string
}

export function PriorityItemsList() {
  const [priorityItems, setPriorityItems] = useState<PriorityItem[]>([])

  useEffect(() => {
    // Get mock data
    const { items } = getMockData()

    // Filter high priority items
    const priorityItems = items
      .filter((item) => item.priority >= 80 && !item.isWaste)
      .map((item) => ({
        itemId: item.itemId,
        name: item.name,
        priority: item.priority,
        zone: item.preferredZone,
      }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 4)

    setPriorityItems(priorityItems)
  }, [])

  if (priorityItems.length === 0) {
    return <div className="text-center text-muted-foreground">No high priority items found</div>
  }

  return (
    <div className="space-y-4">
      {priorityItems.map((item) => (
        <div key={item.itemId} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-muted p-2">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {item.name} (ID: {item.itemId})
              </p>
              <p className="text-xs text-muted-foreground">Priority: {item.priority}/100</p>
            </div>
          </div>
          <div className="text-xs font-medium text-space-blue">{item.zone}</div>
        </div>
      ))}
    </div>
  )
}
