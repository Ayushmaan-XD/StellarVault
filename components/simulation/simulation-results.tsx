"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar, AlertTriangle, Clock } from "lucide-react"
import { getMockData } from "@/lib/mock-data"

export function SimulationResults() {
  const [hasResults, setHasResults] = useState(true)
  const [usedItems, setUsedItems] = useState<any[]>([])
  const [expiredItems, setExpiredItems] = useState<any[]>([])
  const [depletedItems, setDepletedItems] = useState<any[]>([])

  useEffect(() => {
    if (hasResults) {
      // Get mock data
      const { items } = getMockData()

      // Generate random used items
      const usedItems = items
        .filter((item) => item.usageLimit > 0 && item.usesLeft > 0)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)
        .map((item) => ({
          ...item,
          usesUsed: Math.min(item.usesLeft, Math.floor(Math.random() * 5) + 1),
          remainingUses: Math.max(0, item.usesLeft - (Math.floor(Math.random() * 5) + 1)),
        }))

      // Generate random expired items
      const expiredItems = items
        .filter((item) => item.expiryDate && !item.isWaste)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((item) => ({
          ...item,
          expiredOn: new Date(new Date().setDate(new Date().getDate() + Math.floor(Math.random() * 7))).toISOString(),
        }))

      // Generate random depleted items
      const depletedItems = items
        .filter((item) => item.usesLeft <= 3 && !item.isWaste)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map((item) => ({
          ...item,
          originalUses: item.usesLeft,
          usesLeft: 0,
        }))

      setUsedItems(usedItems)
      setExpiredItems(expiredItems)
      setDepletedItems(depletedItems)
    }
  }, [hasResults])

  if (!hasResults) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Clock className="mb-2 h-8 w-8 text-muted-foreground" />
        <h3 className="text-lg font-medium">No Simulation Results</h3>
        <p className="text-sm text-muted-foreground">Run a simulation to see the results here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium">Simulation Complete</h3>
          <p className="text-sm text-muted-foreground">
            Simulated 7 days forward to {new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString()}
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          7 days • {usedItems.length} items used
        </Badge>
      </div>

      <Separator />

      <Tabs defaultValue="items-used">
        <TabsList>
          <TabsTrigger value="items-used">Items Used</TabsTrigger>
          <TabsTrigger value="items-expired">Items Expired</TabsTrigger>
          <TabsTrigger value="items-depleted">Items Depleted</TabsTrigger>
        </TabsList>

        <TabsContent value="items-used" className="space-y-4 pt-4">
          <div className="rounded-lg border">
            <div className="bg-muted px-4 py-2 font-medium">Items Used During Simulation</div>
            <div className="divide-y">
              {usedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {item.name} (ID: {item.itemId})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Remaining Uses: {item.remainingUses}/{item.usageLimit}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Used {item.usesUsed} times</Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="items-expired" className="space-y-4 pt-4">
          <div className="rounded-lg border">
            <div className="bg-muted px-4 py-2 font-medium">Items Expired During Simulation</div>
            <div className="divide-y">
              {expiredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-8 w-8 text-destructive" />
                    <div>
                      <p className="font-medium">
                        {item.name} (ID: {item.itemId})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expired on {new Date(item.expiredOn).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="destructive">Expired</Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="items-depleted" className="space-y-4 pt-4">
          <div className="rounded-lg border">
            <div className="bg-muted px-4 py-2 font-medium">Items Depleted During Simulation</div>
            <div className="divide-y">
              {depletedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="h-8 w-8 text-space-orange" />
                    <div>
                      <p className="font-medium">
                        {item.name} (ID: {item.itemId})
                      </p>
                      <p className="text-sm text-muted-foreground">No uses remaining (0/{item.usageLimit})</p>
                    </div>
                  </div>
                  <Badge variant="default">Depleted</Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="space-y-2">
        <h4 className="font-medium">Recommended Actions</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-md border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-space-blue text-white">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Move {expiredItems.length + depletedItems.length} items to waste container</p>
              <p className="text-sm text-muted-foreground">
                {expiredItems.length} expired items and {depletedItems.length} depleted item should be moved to waste
              </p>
            </div>
            <Button variant="outline" size="sm">
              View Items
            </Button>
          </div>

          <div className="flex items-center gap-3 rounded-md border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-space-orange text-white">
              <Package className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Prepare for resupply mission</p>
              <p className="text-sm text-muted-foreground">Resupply mission arriving in 3 days</p>
            </div>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
