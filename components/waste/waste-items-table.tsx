"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Package, Trash2, Calendar, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data
const wasteItems = [
  {
    id: "006",
    name: "Expired Food Packet",
    reason: "Expired",
    expiryDate: "2023-05-20",
    containerId: "contA",
    zone: "Crew Quarters",
    mass: 5,
  },
  {
    id: "007",
    name: "Empty Oxygen Cylinder",
    reason: "Out of Uses",
    expiryDate: null,
    containerId: "contB",
    zone: "Airlock",
    mass: 30,
  },
  {
    id: "008",
    name: "Used First Aid Kit",
    reason: "Out of Uses",
    expiryDate: "2025-07-10",
    containerId: "contC",
    zone: "Medical Bay",
    mass: 2,
  },
  {
    id: "009",
    name: "Broken Tool",
    reason: "Damaged",
    expiryDate: null,
    containerId: "contC",
    zone: "Laboratory",
    mass: 3,
  },
  {
    id: "010",
    name: "Empty Water Container",
    reason: "Out of Uses",
    expiryDate: "2024-06-15",
    containerId: "contA",
    zone: "Crew Quarters",
    mass: 2,
  },
]

export function WasteItemsTable() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedItems.length === wasteItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(wasteItems.map((item) => item.id))
    }
  }

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  return (
    <div className="space-y-4">
      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-muted p-2">
          <span className="text-sm">
            {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected
          </span>
          <Button variant="outline" size="sm" className="gap-2">
            <Trash2 className="h-4 w-4" />
            <span>Move to Return Container</span>
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedItems.length === wasteItems.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Mass</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wasteItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => toggleSelectItem(item.id)}
                    aria-label={`Select ${item.name}`}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs">{item.id}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.reason === "Expired"
                        ? "destructive"
                        : item.reason === "Out of Uses"
                          ? "default"
                          : "secondary"
                    }
                    className="flex w-fit items-center gap-1"
                  >
                    {item.reason === "Expired" ? (
                      <Calendar className="h-3 w-3" />
                    ) : item.reason === "Out of Uses" ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    <span>{item.reason}</span>
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{item.containerId}</span>
                    <span className="text-muted-foreground">({item.zone})</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{item.mass} kg</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Package className="mr-2 h-4 w-4" />
                        <span>Move</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Mark for Return</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
