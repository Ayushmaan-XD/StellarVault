"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar, Clock, CheckCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface SearchResultsProps {
  item: any | null
  loading: boolean
}

export function SearchResults({ item, loading }: SearchResultsProps) {
  const [retrieving, setRetrieving] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  // Generate retrieval steps based on the found item
  const retrievalSteps = item
    ? [
        { step: 1, action: "remove", itemId: "temp1", itemName: "Adjacent Item" },
        { step: 2, action: "setAside", itemId: "temp1", itemName: "Adjacent Item" },
        { step: 3, action: "retrieve", itemId: item.itemId, itemName: item.name },
        { step: 4, action: "placeBack", itemId: "temp1", itemName: "Adjacent Item" },
      ]
    : []

  const handleRetrieve = () => {
    setRetrieving(true)
    setCurrentStep(1)

    // Simulate retrieval steps
    const totalSteps = retrievalSteps.length

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(interval)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {item ? (
        <>
          <div className="rounded-lg border p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {item.itemId}</p>
              </div>
              <Badge
                variant={item.priority >= 90 ? "destructive" : item.priority >= 70 ? "default" : "secondary"}
                className="text-white bg-space-blue"
              >
                Priority: {item.priority}
              </Badge>
            </div>

            <Separator className="my-4" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Dimensions</p>
                <p className="text-sm text-muted-foreground">
                  {item.width} × {item.depth} × {item.height} cm
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Mass</p>
                <p className="text-sm text-muted-foreground">{item.mass} kg</p>
              </div>
              <div>
                <p className="text-sm font-medium">Expiry Date</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 text-space-orange" />
                  <span>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Uses Left</p>
                <p className="text-sm text-muted-foreground">
                  {item.usesLeft}/{item.usageLimit}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <p className="text-sm font-medium">Location</p>
              <div className="mt-1 flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-space-blue" />
                <span>Container: {item.containerId}</span>
                <span>•</span>
                <span>Zone: {item.preferredZone}</span>
              </div>
              {item.position && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Position: ({item.position.startCoordinates?.width || 0},{item.position.startCoordinates?.depth || 0},
                  {item.position.startCoordinates?.height || 0}) to ({item.position.endCoordinates?.width || item.width}
                  ,{item.position.endCoordinates?.depth || item.depth},
                  {item.position.endCoordinates?.height || item.height})
                </p>
              )}
            </div>

            <div className="mt-4">
              {!retrieving ? (
                <Button onClick={handleRetrieve} className="w-full gap-2 bg-space-blue hover:bg-space-blue/90">
                  <Package className="h-4 w-4" />
                  <span>Retrieve Item</span>
                </Button>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-medium">Retrieval Steps</p>
                  <div className="space-y-2">
                    {retrievalSteps.map((step, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 rounded-md border p-2 ${
                          currentStep > index
                            ? "border-space-teal bg-space-teal/10"
                            : currentStep === index + 1
                              ? "border-space-blue bg-space-blue/10"
                              : "border-muted"
                        }`}
                      >
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${
                            currentStep > index
                              ? "bg-space-teal text-white"
                              : currentStep === index + 1
                                ? "bg-space-blue text-white"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {currentStep > index ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {step.action === "remove"
                              ? "Remove"
                              : step.action === "setAside"
                                ? "Set Aside"
                                : step.action === "retrieve"
                                  ? "Retrieve"
                                  : "Place Back"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {step.itemName} (ID: {step.itemId})
                          </p>
                        </div>
                        {currentStep === index + 1 && (
                          <div className="animate-pulse">
                            <Clock className="h-4 w-4 text-space-blue" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {currentStep > retrievalSteps.length && (
                    <div className="rounded-md border border-space-teal bg-space-teal/10 p-4 text-center">
                      <CheckCircle className="mx-auto mb-2 h-6 w-6 text-space-teal" />
                      <p className="font-medium">Item Retrieved Successfully</p>
                      <p className="text-sm text-muted-foreground">{item.name} has been retrieved and marked as used</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8  text-center">
          <Package className="mb-2 h-8 w-8 text-muted-foreground" />
          <h3 className="text-lg font-medium">No Item Found</h3>
          <p className="text-sm text-muted-foreground">Try searching with a different ID or name</p>
        </div>
      )}
    </div>
  )
}
