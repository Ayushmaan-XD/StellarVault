"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { itemsAPI, containersAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface AddItemFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddItemForm({ open, onOpenChange, onSuccess }: AddItemFormProps) {
  const [loading, setLoading] = useState(false)
  const [containers, setContainers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    itemId: "",
    name: "",
    width: 0,
    depth: 0,
    height: 0,
    mass: 0,
    priority: 50,
    expiryDate: null as Date | null,
    usageLimit: 1,
    usesLeft: 1,
    preferredZone: "",
    containerId: "",
  })
  const { toast } = useToast()

  // Fetch containers when component mounts
  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const { containers: fetchedContainers } = await containersAPI.getAll()
        setContainers(fetchedContainers)
      } catch (error) {
        console.error("Failed to load containers:", error)
      }
    }

    fetchContainers()
  }, [])

  // Fetch containers when dialog opens
  const handleOpenChange = async (open: boolean) => {
    onOpenChange(open)
    if (open) {
      try {
        setLoading(true)
        const { containers: fetchedContainers } = await containersAPI.getAll()
        setContainers(fetchedContainers)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load containers. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      expiryDate: date,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await itemsAPI.create({
        ...formData,
        expiryDate: formData.expiryDate ? formData.expiryDate.toISOString() : null,
      })

      toast({
        title: "Success",
        description: "Item added successfully!",
      })

      // Reset form
      setFormData({
        itemId: "",
        name: "",
        width: 0,
        depth: 0,
        height: 0,
        mass: 0,
        priority: 50,
        expiryDate: null,
        usageLimit: 1,
        usesLeft: 1,
        preferredZone: "",
        containerId: "",
      })

      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>Enter the details for the new cargo item.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemId">Item ID</Label>
                <Input id="itemId" name="itemId" value={formData.itemId} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (cm)</Label>
                <Input
                  id="width"
                  name="width"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.width || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="depth">Depth (cm)</Label>
                <Input
                  id="depth"
                  name="depth"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.depth || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.height || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mass">Mass (kg)</Label>
                <Input
                  id="mass"
                  name="mass"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.mass || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority (0-100)</Label>
                <Input
                  id="priority"
                  name="priority"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.priority || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expiryDate ? format(formData.expiryDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.expiryDate || undefined}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredZone">Preferred Zone</Label>
                <Input
                  id="preferredZone"
                  name="preferredZone"
                  value={formData.preferredZone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  name="usageLimit"
                  type="number"
                  min="1"
                  value={formData.usageLimit || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usesLeft">Uses Left</Label>
                <Input
                  id="usesLeft"
                  name="usesLeft"
                  type="number"
                  min="0"
                  value={formData.usesLeft || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="containerId">Container</Label>
              <Select
                value={formData.containerId}
                onValueChange={(value) => handleSelectChange("containerId", value)}
                required
                disabled={loading || containers.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loading
                        ? "Loading containers..."
                        : containers.length === 0
                          ? "No containers available"
                          : "Select a container"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {containers.length > 0 ? (
                    containers.map((container) => (
                      <SelectItem key={container.containerId} value={container.containerId}>
                        {container.containerId} ({container.zone})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-containers" disabled>
                      {loading ? "Loading containers..." : "No containers available"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {containers.length === 0 && !loading && (
                <p className="text-xs text-destructive mt-1">Please add a container first before adding items.</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || containers.length === 0}>
              {loading ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
