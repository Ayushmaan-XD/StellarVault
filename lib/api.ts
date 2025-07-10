/**
 * API utility functions for interacting with the backend
 */

import { mockAPI } from "./mock-data"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface LoginResponse {
  user: User
  token: string
}

// Base API URL - defaults to relative path in production
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ""

// Custom error class for API errors
export class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

// Mock data storage for anonymous users
const anonymousStorage = {
  items: [],
  containers: [],
  activities: [],
}

// Check if user is anonymous
function isAnonymousUser() {
  if (typeof window === "undefined") return false
  const userStr = localStorage.getItem("user")
  const anonymousUserStr = localStorage.getItem("anonymousUser")
  return !userStr && !!anonymousUserStr
}

// Generate a unique ID
function generateId(prefix = "") {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Generic fetch function with authentication and error handling
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // If user is anonymous, use mock data instead of real API calls
  if (isAnonymousUser()) {
    return handleAnonymousRequest<T>(endpoint, options)
  }

  // Get token from localStorage if available (client-side only)
  let token = ""
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || ""
  }

  // Set up headers
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  try {
    // Make the request
    const response = await fetch(`${API_BASE}/api${endpoint}`, {
      ...options,
      headers,
    })

    // Parse the JSON response
    let data
    try {
      data = await response.json()
    } catch (error) {
      throw new ApiError("Failed to parse response", response.status, { error: "Invalid JSON response" })
    }

    // Handle error responses
    if (!response.ok) {
      throw new ApiError(data.error || "An error occurred", response.status, data)
    }

    return data
  } catch (error) {
    // If it's already an ApiError, rethrow it
    if (error instanceof ApiError) {
      throw error
    }

    // Otherwise, wrap it in an ApiError
    console.error("API request failed:", error)
    throw new ApiError(error instanceof Error ? error.message : "Network request failed", 0, { originalError: error })
  }
}

// Handle requests for anonymous users with mock data
async function handleAnonymousRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Parse the request body if it exists
  let body = {}
  if (options.body) {
    try {
      body = JSON.parse(options.body as string)
    } catch (error) {
      console.error("Error parsing request body:", error)
    }
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Handle different endpoints
  if (endpoint.startsWith("/items")) {
    return handleItemsEndpoint(endpoint, options.method || "GET", body) as unknown as T
  } else if (endpoint.startsWith("/containers")) {
    return handleContainersEndpoint(endpoint, options.method || "GET", body) as unknown as T
  } else if (endpoint.startsWith("/activities")) {
    return handleActivitiesEndpoint(endpoint, options.method || "GET", body) as unknown as T
  } else if (endpoint.startsWith("/waste/identify")) {
    return handleWasteEndpoint() as unknown as T
  } else if (endpoint.startsWith("/simulate/day")) {
    return handleSimulationEndpoint(body) as unknown as T
  }

  // Default response for unhandled endpoints
  return { success: true } as unknown as T
}

// Update the handleItemsEndpoint function to properly update container utilization
function handleItemsEndpoint(endpoint: string, method: string, body: any) {
  // GET all items
  if (endpoint === "/items" && method === "GET") {
    return { items: anonymousStorage.items }
  }

  // GET item by ID
  if (endpoint.match(/^\/items\/[^/]+$/) && method === "GET") {
    const itemId = endpoint.split("/")[2]
    const item = anonymousStorage.items.find((item) => item.itemId === itemId)
    if (!item) {
      throw new ApiError("Item not found", 404, { error: "Item not found" })
    }
    return { item }
  }

  // POST new item
  if (endpoint === "/items" && method === "POST") {
    const newItem = {
      ...body,
      _id: generateId("item_"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    anonymousStorage.items.push(newItem)

    // Update container utilization
    const containerIndex = anonymousStorage.containers.findIndex(
      (container) => container.containerId === newItem.containerId,
    )

    if (containerIndex !== -1) {
      const container = anonymousStorage.containers[containerIndex]

      // Calculate item volume
      const itemVolume = newItem.width * newItem.depth * newItem.height

      // Calculate container volume
      const containerVolume = container.width * container.depth * container.height

      // Calculate volume percentage
      const volumePercentage = (itemVolume / containerVolume) * 100

      // Update container
      anonymousStorage.containers[containerIndex] = {
        ...container,
        currentWeight: container.currentWeight + newItem.mass,
        itemCount: container.itemCount + 1,
        utilization: Math.min(100, container.utilization + volumePercentage),
        updatedAt: new Date().toISOString(),
      }
    }

    // Add activity
    anonymousStorage.activities.unshift({
      _id: generateId("activity_"),
      userId: "anonymous",
      userName: "Anonymous User",
      action: "add",
      itemId: newItem.itemId,
      itemName: newItem.name,
      containerId: newItem.containerId,
      details: `Added ${newItem.name} to ${newItem.containerId}`,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return { item: newItem }
  }

  // PUT update item
  if (endpoint.match(/^\/items\/[^/]+$/) && method === "PUT") {
    const itemId = endpoint.split("/")[2]
    const itemIndex = anonymousStorage.items.findIndex((item) => item.itemId === itemId)
    if (itemIndex === -1) {
      throw new ApiError("Item not found", 404, { error: "Item not found" })
    }

    const updatedItem = {
      ...anonymousStorage.items[itemIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    anonymousStorage.items[itemIndex] = updatedItem

    // Add activity
    anonymousStorage.activities.unshift({
      _id: generateId("activity_"),
      userId: "anonymous",
      userName: "Anonymous User",
      action: "update",
      itemId: updatedItem.itemId,
      itemName: updatedItem.name,
      containerId: updatedItem.containerId,
      details: `Updated ${updatedItem.name}`,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return { item: updatedItem }
  }

  // DELETE item
  if (endpoint.match(/^\/items\/[^/]+$/) && method === "DELETE") {
    const itemId = endpoint.split("/")[2]
    const itemIndex = anonymousStorage.items.findIndex((item) => item.itemId === itemId)
    if (itemIndex === -1) {
      throw new ApiError("Item not found", 404, { error: "Item not found" })
    }

    const deletedItem = anonymousStorage.items[itemIndex]
    anonymousStorage.items.splice(itemIndex, 1)

    // Add activity
    anonymousStorage.activities.unshift({
      _id: generateId("activity_"),
      userId: "anonymous",
      userName: "Anonymous User",
      action: "remove",
      itemId: deletedItem.itemId,
      itemName: deletedItem.name,
      containerId: deletedItem.containerId,
      details: `Removed ${deletedItem.name} from ${deletedItem.containerId}`,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return { message: "Item deleted successfully" }
  }

  throw new ApiError("Not implemented", 501, { error: "Endpoint not implemented for anonymous users" })
}

// Handle containers endpoints for anonymous users
function handleContainersEndpoint(endpoint: string, method: string, body: any) {
  // GET all containers
  if (endpoint === "/containers" && method === "GET") {
    return { containers: anonymousStorage.containers }
  }

  // GET container by ID
  if (endpoint.match(/^\/containers\/[^/]+$/) && method === "GET") {
    const containerId = endpoint.split("/")[2]
    const container = anonymousStorage.containers.find((container) => container.containerId === containerId)
    if (!container) {
      throw new ApiError("Container not found", 404, { error: "Container not found" })
    }

    const items = anonymousStorage.items.filter((item) => item.containerId === containerId)
    return { container, items }
  }

  // POST new container
  if (endpoint === "/containers" && method === "POST") {
    const newContainer = {
      ...body,
      _id: generateId("container_"),
      currentWeight: 0,
      itemCount: 0,
      utilization: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    anonymousStorage.containers.push(newContainer)

    // Add activity
    anonymousStorage.activities.unshift({
      _id: generateId("activity_"),
      userId: "anonymous",
      userName: "Anonymous User",
      action: "add",
      itemId: "",
      itemName: "",
      containerId: newContainer.containerId,
      details: `Added container ${newContainer.containerId} in ${newContainer.zone}`,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return { container: newContainer }
  }

  // PUT update container
  if (endpoint.match(/^\/containers\/[^/]+$/) && method === "PUT") {
    const containerId = endpoint.split("/")[2]
    const containerIndex = anonymousStorage.containers.findIndex((container) => container.containerId === containerId)
    if (containerIndex === -1) {
      throw new ApiError("Container not found", 404, { error: "Container not found" })
    }

    const updatedContainer = {
      ...anonymousStorage.containers[containerIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    anonymousStorage.containers[containerIndex] = updatedContainer

    return { container: updatedContainer }
  }

  // DELETE container
  if (endpoint.match(/^\/containers\/[^/]+$/) && method === "DELETE") {
    const containerId = endpoint.split("/")[2]
    const containerIndex = anonymousStorage.containers.findIndex((container) => container.containerId === containerId)
    if (containerIndex === -1) {
      throw new ApiError("Container not found", 404, { error: "Container not found" })
    }

    // Check if container has items
    const hasItems = anonymousStorage.items.some((item) => item.containerId === containerId)
    if (hasItems) {
      throw new ApiError("Cannot delete container with items", 400, {
        error: "Cannot delete container with items. Move items first.",
      })
    }

    const deletedContainer = anonymousStorage.containers[containerIndex]
    anonymousStorage.containers.splice(containerIndex, 1)

    // Add activity
    anonymousStorage.activities.unshift({
      _id: generateId("activity_"),
      userId: "anonymous",
      userName: "Anonymous User",
      action: "remove",
      itemId: "",
      itemName: "",
      containerId: deletedContainer.containerId,
      details: `Removed container ${deletedContainer.containerId}`,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return { message: "Container deleted successfully" }
  }

  throw new ApiError("Not implemented", 501, { error: "Endpoint not implemented for anonymous users" })
}

// Handle activities endpoints for anonymous users
function handleActivitiesEndpoint(endpoint: string, method: string, body: any) {
  // GET all activities
  if (endpoint.startsWith("/activities") && method === "GET") {
    // Parse query parameters
    const url = new URL(`http://example.com${endpoint}`)
    const limit = Number.parseInt(url.searchParams.get("limit") || "20")
    const page = Number.parseInt(url.searchParams.get("page") || "1")

    const activities = anonymousStorage.activities.slice(0, limit)

    return {
      activities,
      pagination: {
        total: anonymousStorage.activities.length,
        page,
        limit,
        pages: Math.ceil(anonymousStorage.activities.length / limit),
      },
    }
  }

  throw new ApiError("Not implemented", 501, { error: "Endpoint not implemented for anonymous users" })
}

// Handle waste identification for anonymous users
function handleWasteEndpoint() {
  const currentDate = new Date()

  // Find expired items
  const expiredItems = anonymousStorage.items.filter((item) => {
    if (!item.expiryDate) return false
    return new Date(item.expiryDate) < currentDate && !item.isWaste
  })

  // Find items out of uses
  const outOfUsesItems = anonymousStorage.items.filter((item) => {
    return item.usesLeft === 0 && !item.isWaste
  })

  // Mark items as waste
  const wasteItems = []

  for (const item of expiredItems) {
    const itemIndex = anonymousStorage.items.findIndex((i) => i.itemId === item.itemId)
    if (itemIndex !== -1) {
      anonymousStorage.items[itemIndex].isWaste = true
      anonymousStorage.items[itemIndex].wasteReason = "Expired"
      wasteItems.push(anonymousStorage.items[itemIndex])

      // Add activity
      anonymousStorage.activities.unshift({
        _id: generateId("activity_"),
        userId: "anonymous",
        userName: "Anonymous User",
        action: "waste",
        itemId: item.itemId,
        itemName: item.name,
        containerId: item.containerId,
        details: `Marked ${item.name} as waste: Expired`,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  }

  for (const item of outOfUsesItems) {
    const itemIndex = anonymousStorage.items.findIndex((i) => i.itemId === item.itemId)
    if (itemIndex !== -1) {
      anonymousStorage.items[itemIndex].isWaste = true
      anonymousStorage.items[itemIndex].wasteReason = "Out of Uses"
      wasteItems.push(anonymousStorage.items[itemIndex])

      // Add activity
      anonymousStorage.activities.unshift({
        _id: generateId("activity_"),
        userId: "anonymous",
        userName: "Anonymous User",
        action: "waste",
        itemId: item.itemId,
        itemName: item.name,
        containerId: item.containerId,
        details: `Marked ${item.name} as waste: Out of Uses`,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  }

  return {
    wasteItems,
    expiredCount: expiredItems.length,
    outOfUsesCount: outOfUsesItems.length,
    totalCount: wasteItems.length,
  }
}

// Handle simulation for anonymous users
function handleSimulationEndpoint(body: any) {
  const { numOfDays, itemsToBeUsedPerDay } = body

  // Calculate new date
  const currentDate = new Date()
  const newDate = new Date(currentDate)
  newDate.setDate(newDate.getDate() + numOfDays)

  // Process items
  const itemsUsed = []
  const itemsExpired = []
  const itemsDepletedToday = []

  for (const itemUsage of itemsToBeUsedPerDay) {
    const itemIndex = anonymousStorage.items.findIndex((item) => item.itemId === itemUsage.itemId)
    if (itemIndex === -1) continue

    const item = anonymousStorage.items[itemIndex]
    const totalUses = (itemUsage.usesPerDay || 1) * numOfDays
    const remainingUses = Math.max(0, item.usesLeft - totalUses)
    const wasDepletedToday = item.usesLeft > 0 && remainingUses === 0

    anonymousStorage.items[itemIndex].usesLeft = remainingUses

    if (remainingUses === 0 && !item.isWaste) {
      anonymousStorage.items[itemIndex].isWaste = true
      anonymousStorage.items[itemIndex].wasteReason = "Out of Uses"
      itemsDepletedToday.push({
        itemId: item.itemId,
        name: item.name,
      })
    }

    itemsUsed.push({
      itemId: item.itemId,
      name: item.name,
      usesUsed: totalUses,
      remainingUses,
    })

    // Add activity
    anonymousStorage.activities.unshift({
      _id: generateId("activity_"),
      userId: "anonymous",
      userName: "Anonymous User",
      action: "update",
      itemId: item.itemId,
      itemName: item.name,
      containerId: item.containerId,
      details: `Used ${item.name} ${totalUses} times in simulation`,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  // Find newly expired items
  for (const item of anonymousStorage.items) {
    if (!item.expiryDate) continue

    const expiryDate = new Date(item.expiryDate)
    if (expiryDate > currentDate && expiryDate <= newDate && !item.isWaste) {
      const itemIndex = anonymousStorage.items.findIndex((i) => i.itemId === item.itemId)
      if (itemIndex !== -1) {
        anonymousStorage.items[itemIndex].isWaste = true
        anonymousStorage.items[itemIndex].wasteReason = "Expired"

        itemsExpired.push({
          itemId: item.itemId,
          name: item.name,
          expiryDate: item.expiryDate,
        })

        // Add activity
        anonymousStorage.activities.unshift({
          _id: generateId("activity_"),
          userId: "anonymous",
          userName: "Anonymous User",
          action: "waste",
          itemId: item.itemId,
          itemName: item.name,
          containerId: item.containerId,
          details: `Marked ${item.name} as waste: Expired in simulation`,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
    }
  }

  return {
    success: true,
    newDate: newDate.toISOString(),
    changes: {
      itemsUsed,
      itemsExpired,
      itemsDepletedToday,
    },
  }
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    // Mock login
    return {
      user: {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        name: email.split("@")[0],
        email,
        role: "astronaut",
      },
      token: `mock-token-${Date.now()}`,
    }
  },

  register: async (name: string, email: string, password: string, role = "astronaut") => {
    // Mock registration
    return {
      user: {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        name,
        email,
        role,
      },
    }
  },

  logout: async () => {
    // Mock logout
    return { success: true }
  },

  testConnection: async () => {
    // Mock connection test
    return { success: true, message: "Connection successful (mock)" }
  },
}

// API functions for items, containers, etc.
export const itemsAPI = {
  getAll: async (containerId?: string, isWaste?: boolean) => {
    try {
      return mockAPI.getItems(containerId, isWaste)
    } catch (error) {
      console.error("Error fetching items:", error)
      throw error
    }
  },

  getById: async (itemId: string) => {
    try {
      return mockAPI.getItem(itemId)
    } catch (error) {
      console.error("Error fetching item:", error)
      throw error
    }
  },

  create: async (itemData: any) => {
    try {
      return mockAPI.createItem(itemData)
    } catch (error) {
      console.error("Error creating item:", error)
      throw error
    }
  },

  update: async (itemId: string, itemData: any) => {
    try {
      // This is a mock implementation
      return { item: { ...itemData, itemId } }
    } catch (error) {
      console.error("Error updating item:", error)
      throw error
    }
  },

  delete: async (itemId: string) => {
    try {
      // This is a mock implementation
      return { message: "Item deleted successfully" }
    } catch (error) {
      console.error("Error deleting item:", error)
      throw error
    }
  },
}

export const containersAPI = {
  getAll: async (zone?: string) => {
    try {
      return mockAPI.getContainers()
    } catch (error) {
      console.error("Error fetching containers:", error)
      throw error
    }
  },

  getById: async (containerId: string) => {
    try {
      return mockAPI.getContainer(containerId)
    } catch (error) {
      console.error("Error fetching container:", error)
      throw error
    }
  },

  create: async (containerData: any) => {
    try {
      return mockAPI.createContainer(containerData)
    } catch (error) {
      console.error("Error creating container:", error)
      throw error
    }
  },

  update: async (containerId: string, containerData: any) => {
    try {
      return mockAPI.updateContainer(containerId, containerData)
    } catch (error) {
      console.error("Error updating container:", error)
      throw error
    }
  },

  delete: async (containerId: string) => {
    try {
      return mockAPI.deleteContainer(containerId)
    } catch (error) {
      console.error("Error deleting container:", error)
      throw error
    }
  },
}

export const activitiesAPI = {
  getAll: async (params?: any) => {
    try {
      return mockAPI.getActivities(params)
    } catch (error) {
      console.error("Error fetching activities:", error)
      throw error
    }
  },
}

export const wasteAPI = {
  identifyWaste: async () => {
    // Mock waste identification
    return {
      wasteItems: [],
      expiredCount: 3,
      outOfUsesCount: 2,
      totalCount: 5,
    }
  },
}

export const simulationAPI = {
  simulateDays: async (numOfDays: number, itemsToBeUsedPerDay: any[]) => {
    // Mock simulation
    return {
      success: true,
      newDate: new Date(Date.now() + numOfDays * 24 * 60 * 60 * 1000).toISOString(),
      changes: {
        itemsUsed: [],
        itemsExpired: [],
        itemsDepletedToday: [],
      },
    }
  },
}

export default {
  auth: authAPI,
  items: itemsAPI,
  containers: containersAPI,
  activities: activitiesAPI,
  waste: wasteAPI,
  simulation: simulationAPI,
}
