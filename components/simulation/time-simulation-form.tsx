"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Clock, FastForward, Plus, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays } from "date-fns"
import { getMockData } from "@/lib/mock-data"
import { useToast } from "@/components/ui/use-toast"

export function TimeSimulationForm() {
  const [date, setDate] = useState<Date>(new Date())
  const [days, setDays] = useState(1)
  const [items, setItems] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Load some items from mock data
  useState(() => {
    const { items: mockItems } = getMockData()
    const selectedItems = mockItems
      .filter((item) => item.usageLimit > 0 && item.usesLeft > 0 && !item.isWaste)
      .sort(() => 0.5 - Math.random())
      .slice(0, 1)
      .map((item) => ({ id: item.itemId, name: item.name }))

    setItems(selectedItems)
  })

  const addItem = () => {
    const { items: mockItems } = getMockData()
    const availableItems = mockItems.filter(
      (item) => item.usageLimit > 0 && item.usesLeft > 0 && !item.isWaste && !items.some((i) => i.id === item.itemId),
    )

    if (availableItems.length > 0) {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)]
      setItems([...items, { id: randomItem.itemId, name: randomItem.name }])
    }
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: "id" | "name", value: string) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const handleSimulate = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Simulation Complete",
        description: `Simulated ${days} days forward to ${format(addDays(new Date(), days), "PPP")}`,
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Simulation Method</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="flex-1 justify-start gap-2" onClick={() => setDays(1)}>
            <Clock className="h-4 w-4" />
            <span>Next Day</span>
          </Button>
          <Button variant="outline" className="flex-1 justify-start gap-2" onClick={() => setDays(7)}>
            <FastForward className="h-4 w-4" />
            <span>Fast Forward</span>
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-start gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Specific Date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="days">Number of Days</Label>
        <Input
          id="days"
          type="number"
          min="1"
          value={days}
          onChange={(e) => setDays(Number.parseInt(e.target.value) || 1)}
        />
        <p className="text-xs text-muted-foreground">Simulating to: {format(addDays(new Date(), days), "PPP")}</p>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Items to Be Used Per Day</Label>
          <Button variant="outline" size="sm" className="h-7 gap-1" onClick={addItem}>
            <Plus className="h-3 w-3" />
            <span>Add</span>
          </Button>
        </div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Item ID"
                value={item.id}
                onChange={(e) => updateItem(index, "id", e.target.value)}
                className="w-24"
              />
              <Input
                placeholder="Item Name"
                value={item.name}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full gap-2" onClick={handleSimulate} disabled={loading}>
        <FastForward className="h-4 w-4" />
        <span>{loading ? "Running Simulation..." : "Run Simulation"}</span>
      </Button>
    </div>
  )
}
