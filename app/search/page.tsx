"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, Package, ArrowRight } from "lucide-react"
import { SearchResults } from "@/components/search/search-results"
import { ContainerVisualization } from "@/components/search/container-visualization"
import { itemsAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any | null>(null)
  const [recentSearches, setRecentSearches] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter an item ID or name to search.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Get all items and filter based on search query
      const response = await itemsAPI.getAll()
      const items = response.items

      // Filter items based on search query (case insensitive)
      const filteredItems = items.filter(
        (item) =>
          item.itemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      if (filteredItems.length > 0) {
        // Use the first matching item as the result
        const foundItem = filteredItems[0]

        // Add to recent searches if not already there
        const isAlreadyInRecent = recentSearches.some((item) => item.itemId === foundItem.itemId)
        if (!isAlreadyInRecent) {
          // Add to the beginning and limit to 3 items
          setRecentSearches((prev) => [foundItem, ...prev].slice(0, 3))
        }

        setSearchResults(foundItem)
      } else {
        setSearchResults(null)
        toast({
          title: "No Results",
          description: "No items found matching your search criteria.",
        })
      }
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search Error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRecentSearch = (item: any) => {
    setSearchQuery(item.itemId)
    setSearchResults(item)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search & Retrieve</h1>
          <p className="text-muted-foreground">Find and retrieve items from the space station</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search for Items</CardTitle>
            <CardDescription>Enter an item ID or name to locate it</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by ID or name..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button className="gap-2 bg-space-blue hover:bg-space-blue/90" onClick={handleSearch} disabled={loading}>
                <SearchIcon className="h-4 w-4" />
                <span>{loading ? "Searching..." : "Search"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>Item details and retrieval instructions</CardDescription>
            </CardHeader>
            <CardContent>
              <SearchResults item={searchResults} loading={loading} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Container Visualization</CardTitle>
              <CardDescription>3D view of the container and item location</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-square w-full overflow-hidden rounded-b-lg">
                <ContainerVisualization containerId={searchResults?.containerId} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSearches.length > 0 ? (
                recentSearches.map((item) => (
                  <div key={item.itemId} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <Package className="h-8 w-8 text-space-blue" />
                      <div>
                        <p className="font-medium">
                          {item.name} (ID: {item.itemId})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Container: {item.containerId} • Zone: {item.preferredZone}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-space-blue hover:text-space-blue/90 hover:bg-space-blue/10"
                      onClick={() => handleRecentSearch(item)}
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <SearchIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No Recent Searches</h3>
                  <p className="text-sm text-muted-foreground">Your recent searches will appear here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
