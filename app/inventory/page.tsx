"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Download, Plus, Filter, Search } from "lucide-react"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { ContainersGrid } from "@/components/inventory/containers-grid"
import { AddItemForm } from "@/components/inventory/add-item-form"
import { AddContainerForm } from "@/components/inventory/add-container-form"
import { itemsAPI, containersAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function InventoryPage() {
  const [items, setItems] = useState([])
  const [containers, setContainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [addItemOpen, setAddItemOpen] = useState(false)
  const [addContainerOpen, setAddContainerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("items")
  const { toast } = useToast()

  const fetchData = async () => {
    try {
      setLoading(true)
      const [itemsResponse, containersResponse] = await Promise.all([itemsAPI.getAll(), containersAPI.getAll()])
      setItems(itemsResponse.items)
      setContainers(containersResponse.containers)
    } catch (error) {
      console.error("Error fetching inventory data:", error)
      toast({
        title: "Error",
        description: "Failed to load inventory data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [toast])

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
            <p className="text-muted-foreground">Manage and organize cargo items and containers</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => (activeTab === "items" ? setAddItemOpen(true) : setAddContainerOpen(true))}
            >
              <Plus className="h-4 w-4" />
              <span>Add {activeTab === "items" ? "Item" : "Container"}</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="items" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="containers">Containers</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Cargo Items</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search items..."
                        className="w-full pl-8 sm:w-[300px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Filter</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <InventoryTable items={filteredItems} loading={loading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="containers" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Storage Containers</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="search" placeholder="Search containers..." className="w-full pl-8 sm:w-[300px]" />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Filter</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ContainersGrid containers={containers} loading={loading} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Item Form Dialog */}
      <AddItemForm open={addItemOpen} onOpenChange={setAddItemOpen} onSuccess={fetchData} />

      {/* Add Container Form Dialog */}
      <AddContainerForm open={addContainerOpen} onOpenChange={setAddContainerOpen} onSuccess={fetchData} />
    </DashboardLayout>
  )
}
