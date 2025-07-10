"use client"

import type React from "react"
import { useState } from "react"
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
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface AddContainerFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddContainerForm({ open, onOpenChange, onSuccess }: AddContainerFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    containerId: "",
    zone: "",
    width: 0,
    depth: 0,
    height: 0,
    maxWeight: 0,
  })
  const { toast } = useToast()
  const { isAuthenticated, showAuthModal, setShowAuthModal } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add a container.",
        variant: "destructive",
      })

      // Show auth modal
      setShowAuthModal(true)
      return
    }

    setLoading(true)

    try {
      // Ensure all numeric values are positive
      const validatedData = {
        ...formData,
        width: Math.max(0, formData.width),
        depth: Math.max(0, formData.depth),
        height: Math.max(0, formData.height),
        maxWeight: Math.max(0, formData.maxWeight),
      }

      // Get token from localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Send request to API
      const response = await fetch("/api/containers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add container")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Container added successfully!",
      })

      // Reset form
      setFormData({
        containerId: "",
        zone: "",
        width: 0,
        depth: 0,
        height: 0,
        maxWeight: 0,
      })

      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error("Error adding container:", error)

      toast({
        title: "Error",
        description: error.message || "Failed to add container. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Container</DialogTitle>
            <DialogDescription>Enter the details for the new storage container.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="containerId">Container ID</Label>
                <Input
                  id="containerId"
                  name="containerId"
                  value={formData.containerId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zone">Zone</Label>
                <Input id="zone" name="zone" value={formData.zone} onChange={handleChange} required />
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

            <div className="space-y-2">
              <Label htmlFor="maxWeight">Maximum Weight (kg)</Label>
              <Input
                id="maxWeight"
                name="maxWeight"
                type="number"
                min="0"
                step="0.1"
                value={formData.maxWeight || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Container"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
