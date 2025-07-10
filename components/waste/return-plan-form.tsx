"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Package, Trash2, ArrowRight } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

export function ReturnPlanForm() {
  const [date, setDate] = useState<Date>()
  const [showPlan, setShowPlan] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowPlan(true)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="container">Undocking Container</Label>
            <Select defaultValue="contF">
              <SelectTrigger id="container">
                <SelectValue placeholder="Select container" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contF">contF (Command Center)</SelectItem>
                <SelectItem value="contG">contG (Airlock)</SelectItem>
                <SelectItem value="contH">contH (Docking Bay)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Undocking Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Maximum Weight (kg)</Label>
          <Input id="weight" type="number" defaultValue="100" />
        </div>

        <div className="space-y-2">
          <Label>Items to Return</Label>
          <div className="rounded-md border">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-muted-foreground" />
                <span>All Waste Items (8)</span>
              </div>
              <span className="text-sm text-muted-foreground">42 kg total</span>
            </div>
            <Separator />
            <div className="p-3 text-sm text-muted-foreground">
              <p>Includes:</p>
              <ul className="ml-6 list-disc">
                <li>Expired items (3)</li>
                <li>Items out of uses (4)</li>
                <li>Damaged items (1)</li>
              </ul>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Generate Return Plan
        </Button>
      </form>

      {showPlan && (
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Return Plan</h3>
            <Badge variant="outline">8 items • 42 kg</Badge>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Step 1: Retrieval</h4>
              <p className="text-sm text-muted-foreground">Collect all waste items from their current locations</p>
            </div>

            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-md border p-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">{i}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Retrieve from Container contA</p>
                    <p className="text-xs text-muted-foreground">Expired Food Packet, Empty Water Container</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Step 2: Packing</h4>
              <p className="text-sm text-muted-foreground">Pack all waste items into the undocking container</p>
            </div>

            <div className="rounded-md border p-3">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Container: contF</p>
                  <p className="text-sm text-muted-foreground">Command Center • 80 × 70 × 180 cm</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Step 3: Undocking</h4>
              <p className="text-sm text-muted-foreground">
                Schedule undocking for {date ? format(date, "PPP") : "selected date"}
              </p>
            </div>

            <Button className="w-full gap-2">
              <Trash2 className="h-4 w-4" />
              <span>Complete Undocking</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
