"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import { getMockData } from "@/lib/mock-data"

interface ExpiringItem {
  itemId: string
  name: string
  expiryDate: string
  daysRemaining: number
}

export function ExpiringItemsList() {
  const [expiringItems, setExpiringItems] = useState<ExpiringItem[]>([])

  useEffect(() => {
    // Get mock data
    const { items } = getMockData()

    // Get current date
    const currentDate = new Date()

    // Filter items that will expire in the next 7 days
    const expiringItems = items
      .filter((item) => {
        if (!item.expiryDate) return false

        const expiryDate = new Date(item.expiryDate)
        const diffTime = expiryDate.getTime() - currentDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return diffDays > 0 && diffDays <= 7 && !item.isWaste
      })
      .map((item) => {
        const expiryDate = new Date(item.expiryDate!)
        const diffTime = expiryDate.getTime() - currentDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return {
          itemId: item.itemId,
          name: item.name,
          expiryDate: item.expiryDate!,
          daysRemaining: diffDays,
        }
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, 5)

    setExpiringItems(expiringItems)
  }, [])

  if (expiringItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Calendar className="mb-2 h-8 w-8 text-muted-foreground" />
        <h3 className="text-lg font-medium">No Expiring Items</h3>
        <p className="text-sm text-muted-foreground">All items are within their expiry dates</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {expiringItems.map((item) => (
        <div key={item.itemId} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {item.name} (ID: {item.itemId})
              </p>
              <p className="text-sm text-muted-foreground">
                Expires in {item.daysRemaining} day{item.daysRemaining !== 1 ? "s" : ""}
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
