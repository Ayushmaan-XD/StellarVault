"use client"

import { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Calendar, Package, AlertTriangle } from "lucide-react"
import { getMockData } from "@/lib/mock-data"

export function CurrentStatus() {
  const [stats, setStats] = useState({
    totalItems: 0,
    expiringItems: 0,
    lowUsesItems: 0,
    wasteItems: 0,
  })

  useEffect(() => {
    // Get mock data
    const { items } = getMockData()

    // Calculate stats
    const currentDate = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    const totalItems = items.length

    const expiringItems = items.filter((item) => {
      if (!item.expiryDate) return false
      const expiryDate = new Date(item.expiryDate)
      return expiryDate > currentDate && expiryDate <= nextWeek && !item.isWaste
    }).length

    const lowUsesItems = items.filter((item) => {
      if (item.usageLimit === 0) return false
      const percentage = (item.usesLeft / item.usageLimit) * 100
      return percentage <= 10 && percentage > 0 && !item.isWaste
    }).length

    const wasteItems = items.filter((item) => item.isWaste).length

    setStats({
      totalItems,
      expiringItems,
      lowUsesItems,
      wasteItems,
    })
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Current Date</span>
        </div>
        <span>{new Date().toLocaleDateString()}</span>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Total Items</span>
          <span className="font-medium">{stats.totalItems}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Items Expiring in 7 Days</span>
          <span className="font-medium text-space-orange">{stats.expiringItems}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Items Low on Uses</span>
          <span className="font-medium text-space-orange">{stats.lowUsesItems}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Waste Items</span>
          <span className="font-medium text-space-red">{stats.wasteItems}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="font-medium">Next Scheduled Events</h4>
        <div className="rounded-md border p-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Resupply Mission</p>
              <p className="text-sm text-muted-foreground">
                {new Date(new Date().setDate(new Date().getDate() + 10)).toLocaleDateString()} (in 10 days)
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-md border p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Waste Return</p>
              <p className="text-sm text-muted-foreground">
                {new Date(new Date().setDate(new Date().getDate() + 21)).toLocaleDateString()} (in 21 days)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
