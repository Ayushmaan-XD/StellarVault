"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Package, ArrowRight } from "lucide-react"
import { getMockData } from "@/lib/mock-data"

interface LowUsesItem {
  itemId: string
  name: string
  usesLeft: number
  usageLimit: number
  percentage: number
}

export function LowUsesItemsList() {
  const [lowUsesItems, setLowUsesItems] = useState<LowUsesItem[]>([])

  useEffect(() => {
    // Get mock data
    const { items } = getMockData()

    // Filter items with less than 10% of uses remaining
    const lowUsesItems = items
      .filter((item) => {
        if (item.usageLimit === 0) return false
        const percentage = (item.usesLeft / item.usageLimit) * 100
        return percentage <= 10 && percentage > 0 && !item.isWaste
      })
      .map((item) => {
        const percentage = (item.usesLeft / item.usageLimit) * 100

        return {
          itemId: item.itemId,
          name: item.name,
          usesLeft: item.usesLeft,
          usageLimit: item.usageLimit,
          percentage: Math.round(percentage),
        }
      })
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 5)

    setLowUsesItems(lowUsesItems)
  }, [])

  if (lowUsesItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Package className="mb-2 h-8 w-8 text-muted-foreground" />
        <h3 className="text-lg font-medium">No Low-Use Items</h3>
        <p className="text-sm text-muted-foreground">All items have sufficient uses remaining</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {lowUsesItems.map((item) => (
        <div key={item.itemId} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-4">
            <Package className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {item.name} (ID: {item.itemId})
              </p>
              <p className="text-sm text-muted-foreground">
                {item.usesLeft} uses remaining ({item.percentage}%)
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">View details</span>
          </Button>
        </div>
      ))}
    </div>
  )
}
