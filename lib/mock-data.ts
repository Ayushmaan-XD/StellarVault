// Mock data generator for the application

// Generate a random ID with a prefix
export function generateId(prefix = ""): string {
  return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`
}

// Generate a random date within a range
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Generate a random number within a range
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate a random boolean with a probability
export function randomBoolean(probability = 0.5): boolean {
  return Math.random() < probability
}

// Generate a random element from an array
export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Generate a random color
export function randomColor(): string {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`
}

// Generate a random name
export function randomName(): string {
  const firstNames = [
    "James",
    "John",
    "Robert",
    "Michael",
    "William",
    "David",
    "Richard",
    "Joseph",
    "Thomas",
    "Charles",
    "Mary",
    "Patricia",
    "Jennifer",
    "Linda",
    "Elizabeth",
    "Barbara",
    "Susan",
    "Jessica",
    "Sarah",
    "Karen",
  ]

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Jones",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Martinez",
    "Robinson",
  ]

  return `${randomElement(firstNames)} ${randomElement(lastNames)}`
}

// Generate a random email
export function randomEmail(name?: string): string {
  const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "example.com"]
  const username = name ? name.toLowerCase().replace(/\s+/g, ".") : `user${randomNumber(1000, 9999)}`
  return `${username}@${randomElement(domains)}`
}

// Generate a random container
export function generateContainer() {
  const zones = ["Crew Quarters", "Airlock", "Laboratory", "Command Center", "Storage Bay", "Medical Bay"]
  const containerId = `cont${String.fromCharCode(65 + randomNumber(0, 25))}${randomNumber(1, 99)}`

  const width = randomNumber(50, 200)
  const depth = randomNumber(50, 200)
  const height = randomNumber(50, 200)
  const maxWeight = randomNumber(50, 500)
  const currentWeight = randomNumber(0, maxWeight)
  const itemCount = randomNumber(0, 20)
  const utilization = randomNumber(0, 100)

  return {
    id: generateId("container_"),
    containerId,
    zone: randomElement(zones),
    width,
    depth,
    height,
    maxWeight,
    currentWeight,
    itemCount,
    utilization,
    created_at: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
    updated_at: new Date().toISOString(),
  }
}

// Generate a random item
export function generateItem(containerId?: string) {
  const itemTypes = [
    "Food Packet",
    "Water Container",
    "Oxygen Cylinder",
    "Medical Kit",
    "Tool Kit",
    "Experiment Equipment",
  ]
  const zones = ["Crew Quarters", "Airlock", "Laboratory", "Command Center", "Storage Bay", "Medical Bay"]
  const wasteReasons = ["Expired", "Out of Uses", "Damaged"]

  const itemId = `item${randomNumber(100, 999)}`
  const name = `${randomElement(itemTypes)} #${randomNumber(1, 99)}`
  const width = randomNumber(10, 50)
  const depth = randomNumber(10, 50)
  const height = randomNumber(10, 50)
  const mass = randomNumber(1, 30)
  const priority = randomNumber(1, 100)

  // 30% chance of having an expiry date
  const hasExpiryDate = randomBoolean(0.3)
  const expiryDate = hasExpiryDate
    ? randomDate(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 2))).toISOString()
    : null

  const usageLimit = randomNumber(1, 100)
  const usesLeft = randomNumber(0, usageLimit)
  const preferredZone = randomElement(zones)
  const actualContainerId = containerId || `cont${String.fromCharCode(65 + randomNumber(0, 25))}${randomNumber(1, 99)}`

  // 10% chance of being waste
  const isWaste = randomBoolean(0.1)
  const wasteReason = isWaste ? randomElement(wasteReasons) : null

  // Generate a random position within the container
  const position = {
    startCoordinates: {
      width: randomNumber(0, 20),
      depth: randomNumber(0, 20),
      height: randomNumber(0, 20),
    },
    endCoordinates: {
      width: randomNumber(20, 40),
      depth: randomNumber(20, 40),
      height: randomNumber(20, 40),
    },
  }

  return {
    id: generateId("item_"),
    itemId,
    name,
    width,
    depth,
    height,
    mass,
    priority,
    expiryDate,
    usageLimit,
    usesLeft,
    preferredZone,
    containerId: actualContainerId,
    position,
    isWaste,
    wasteReason,
    createdBy: generateId("user_"),
    created_at: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
    updated_at: new Date().toISOString(),
  }
}

// Generate a random activity
export function generateActivity() {
  const actions = ["add", "remove", "update", "retrieve", "move", "waste"]
  const itemTypes = [
    "Food Packet",
    "Water Container",
    "Oxygen Cylinder",
    "Medical Kit",
    "Tool Kit",
    "Experiment Equipment",
  ]

  const action = randomElement(actions)
  const itemId = `item${randomNumber(100, 999)}`
  const itemName = `${randomElement(itemTypes)} #${randomNumber(1, 99)}`
  const containerId = `cont${String.fromCharCode(65 + randomNumber(0, 25))}${randomNumber(1, 99)}`

  let details = ""
  switch (action) {
    case "add":
      details = `Added ${itemName} to ${containerId}`
      break
    case "remove":
      details = `Removed ${itemName} from ${containerId}`
      break
    case "update":
      details = `Updated ${itemName} information`
      break
    case "retrieve":
      details = `Retrieved ${itemName} from ${containerId}`
      break
    case "move":
      const targetContainerId = `cont${String.fromCharCode(65 + randomNumber(0, 25))}${randomNumber(1, 99)}`
      details = `Moved ${itemName} from ${containerId} to ${targetContainerId}`
      break
    case "waste":
      const wasteReasons = ["Expired", "Out of Uses", "Damaged"]
      details = `Marked ${itemName} as waste: ${randomElement(wasteReasons)}`
      break
  }

  return {
    id: generateId("activity_"),
    userId: generateId("user_"),
    userName: randomName(),
    action,
    itemId,
    itemName,
    containerId,
    details,
    timestamp: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
    created_at: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
  }
}

// Generate a set of mock data for the application
export function generateMockData(containerCount = 10, itemsPerContainer = 5, activityCount = 20) {
  // Generate containers
  const containers = Array.from({ length: containerCount }, () => generateContainer())

  // Generate items for each container
  const items = containers.flatMap((container) =>
    Array.from({ length: randomNumber(1, itemsPerContainer) }, () => generateItem(container.containerId)),
  )

  // Generate activities
  const activities = Array.from({ length: activityCount }, () => generateActivity())

  return {
    containers,
    items,
    activities,
  }
}

// Initialize mock data in localStorage if it doesn't exist
export function initMockData() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem("mockData")) {
    const mockData = generateMockData()
    localStorage.setItem("mockData", JSON.stringify(mockData))
  }

  return JSON.parse(localStorage.getItem("mockData") || "{}")
}

// Get mock data from localStorage
export function getMockData() {
  if (typeof window === "undefined") return { containers: [], items: [], activities: [] }

  const mockData = localStorage.getItem("mockData")
  if (!mockData) {
    return initMockData()
  }

  return JSON.parse(mockData)
}

// Update mock data in localStorage
export function updateMockData(data: any) {
  if (typeof window === "undefined") return

  localStorage.setItem("mockData", JSON.stringify(data))
}

// Mock API functions
export const mockAPI = {
  // Containers
  getContainers: () => {
    const { containers } = getMockData()
    return { containers }
  },

  getContainer: (containerId: string) => {
    const { containers, items } = getMockData()
    const container = containers.find((c) => c.containerId === containerId)
    const containerItems = items.filter((item) => item.containerId === containerId)

    if (!container) {
      throw new Error("Container not found")
    }

    return { container, items: containerItems }
  },

  createContainer: (containerData: any) => {
    const mockData = getMockData()

    // Check if container ID already exists
    if (mockData.containers.some((c) => c.containerId === containerData.containerId)) {
      throw new Error("Container ID already exists")
    }

    const newContainer = {
      ...containerData,
      id: generateId("container_"),
      currentWeight: 0,
      itemCount: 0,
      utilization: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockData.containers.push(newContainer)
    updateMockData(mockData)

    return { container: newContainer }
  },

  updateContainer: (containerId: string, containerData: any) => {
    const mockData = getMockData()
    const containerIndex = mockData.containers.findIndex((c) => c.containerId === containerId)

    if (containerIndex === -1) {
      throw new Error("Container not found")
    }

    const updatedContainer = {
      ...mockData.containers[containerIndex],
      ...containerData,
      updated_at: new Date().toISOString(),
    }

    mockData.containers[containerIndex] = updatedContainer
    updateMockData(mockData)

    return { container: updatedContainer }
  },

  deleteContainer: (containerId: string) => {
    const mockData = getMockData()

    // Check if container has items
    if (mockData.items.some((item) => item.containerId === containerId)) {
      throw new Error("Cannot delete container with items")
    }

    const containerIndex = mockData.containers.findIndex((c) => c.containerId === containerId)

    if (containerIndex === -1) {
      throw new Error("Container not found")
    }

    mockData.containers.splice(containerIndex, 1)
    updateMockData(mockData)

    return { message: "Container deleted successfully" }
  },

  // Items
  getItems: (containerId?: string, isWaste?: boolean) => {
    const { items } = getMockData()
    let filteredItems = items

    if (containerId) {
      filteredItems = filteredItems.filter((item) => item.containerId === containerId)
    }

    if (isWaste !== undefined) {
      filteredItems = filteredItems.filter((item) => item.isWaste === isWaste)
    }

    return { items: filteredItems }
  },

  getItem: (itemId: string) => {
    const { items } = getMockData()
    const item = items.find((item) => item.itemId === itemId)

    if (!item) {
      throw new Error("Item not found")
    }

    return { item }
  },

  createItem: (itemData: any) => {
    const mockData = getMockData()

    // Check if item ID already exists
    if (mockData.items.some((item) => item.itemId === itemData.itemId)) {
      throw new Error("Item ID already exists")
    }

    // Check if container exists
    const container = mockData.containers.find((c) => c.containerId === itemData.containerId)
    if (!container) {
      throw new Error("Container not found")
    }

    const newItem = {
      ...itemData,
      id: generateId("item_"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockData.items.push(newItem)

    // Update container
    const containerIndex = mockData.containers.findIndex((c) => c.containerId === itemData.containerId)
    mockData.containers[containerIndex].itemCount += 1
    mockData.containers[containerIndex].currentWeight += itemData.mass
    mockData.containers[containerIndex].utilization = Math.min(
      100,
      mockData.containers[containerIndex].utilization + randomNumber(5, 15),
    )

    // Add activity
    mockData.activities.unshift({
      id: generateId("activity_"),
      userId: itemData.createdBy || "anonymous",
      userName: "User",
      action: "add",
      itemId: itemData.itemId,
      itemName: itemData.name,
      containerId: itemData.containerId,
      details: `Added ${itemData.name} to ${itemData.containerId}`,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })

    updateMockData(mockData)

    return { item: newItem }
  },

  // Activities
  getActivities: (params?: any) => {
    const { activities } = getMockData()
    const { limit = 20, page = 1 } = params || {}

    const paginatedActivities = activities.slice(0, limit)

    return {
      activities: paginatedActivities,
      pagination: {
        total: activities.length,
        page,
        limit,
        pages: Math.ceil(activities.length / limit),
      },
    }
  },
}
