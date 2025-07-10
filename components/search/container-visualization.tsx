"use client"

import { Suspense, useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Text, Float, Sparkles, useHelper } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { useTheme } from "next-themes"
import * as THREE from "three"
import { containersAPI } from "@/lib/api"

interface ContainerProps {
  containerId?: string
  containerData?: any
  itemsData?: any[]
}

function Container({ containerId, containerData, itemsData }: ContainerProps) {
  const { theme } = useTheme()
  const containerRef = useRef<THREE.Mesh>(null)
  const targetItemRef = useRef<THREE.Mesh>(null)
  const highlightRef = useRef<THREE.Mesh>(null)

  // Add box helper for the container
  useHelper(containerRef, THREE.BoxHelper, theme === "dark" ? "white" : "#666")

  useFrame(({ clock }) => {
    if (highlightRef.current) {
      // Pulsing animation for the highlight
      highlightRef.current.material.opacity = 0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.2

      // Rotate the highlight slightly
      highlightRef.current.rotation.y = clock.getElapsedTime() * 0.2
    }

    if (targetItemRef.current) {
      // Subtle floating animation for the target item
      targetItemRef.current.position.y = 0.5 + Math.sin(clock.getElapsedTime()) * 0.05
    }
  })

  // Colors based on theme
  const containerColor = theme === "dark" ? "#888" : "#aaa"
  const waterContainerColor = theme === "dark" ? "#44ff88" : "#66ffaa"
  const foodPacketColor = theme === "dark" ? "#ff8844" : "#ffaa66"
  const highlightColor = theme === "dark" ? "#4488ff" : "#4466ff" // Changed to blue to match theme

  // If we have container data, use its dimensions
  const containerWidth = containerData ? containerData.width / 100 : 4
  const containerHeight = containerData ? containerData.height / 100 : 4
  const containerDepth = containerData ? containerData.depth / 100 : 8

  return (
    <group>
      {/* Container */}
      <mesh ref={containerRef} position={[0, 0, 0]}>
        <boxGeometry args={[containerWidth, containerHeight, containerDepth]} />
        <meshStandardMaterial color={containerColor} transparent opacity={0.2} />
      </mesh>

      {/* Container label */}
      <Text
        position={[0, containerHeight / 2 + 0.1, 0]}
        fontSize={0.5}
        color={theme === "dark" ? "#fff" : "#000"}
        anchorX="center"
        anchorY="middle"
      >
        Container: {containerId || "None"}
      </Text>

      {/* Items in container */}
      {itemsData && itemsData.length > 0 ? (
        itemsData.map((item, index) => (
          <Float key={item.itemId} speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
            <mesh
              position={[0, -containerHeight / 4 + index * 0.5, 0]}
              scale={[0.9, 0.9, 0.9]}
              ref={index === 0 ? targetItemRef : undefined}
            >
              <boxGeometry args={[item.width / 150, item.height / 150, item.depth / 150]} />
              <meshStandardMaterial
                color={index === 0 ? foodPacketColor : waterContainerColor}
                metalness={0.5}
                roughness={0.3}
              />
              <Text
                position={[0, item.height / 300 + 0.1, 0]}
                fontSize={0.3}
                color="#000"
                anchorX="center"
                anchorY="middle"
              >
                {item.name}
              </Text>
            </mesh>
          </Float>
        ))
      ) : (
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh position={[0, -1, 0]} scale={[0.9, 0.9, 0.9]}>
            <boxGeometry args={[3.5, 1.5, 7.5]} />
            <meshStandardMaterial color={waterContainerColor} metalness={0.5} roughness={0.3} />
            <Text position={[0, 0.8, 0]} fontSize={0.3} color="#000" anchorX="center" anchorY="middle">
              Empty Container
            </Text>
          </mesh>
        </Float>
      )}

      {/* Highlight for target item */}
      {itemsData && itemsData.length > 0 && (
        <mesh ref={highlightRef} position={[0, -containerHeight / 4, 0]} scale={[1.1, 1.1, 1.1]}>
          <boxGeometry
            args={[
              (itemsData[0].width / 150) * 1.1,
              (itemsData[0].height / 150) * 1.1,
              (itemsData[0].depth / 150) * 1.1,
            ]}
          />
          <meshStandardMaterial color={highlightColor} wireframe={true} transparent={true} opacity={0.5} />
        </mesh>
      )}

      {/* Add sparkles inside the container */}
      <Sparkles
        count={50}
        scale={[containerWidth * 0.8, containerHeight * 0.8, containerDepth * 0.8]}
        position={[0, 0, 0]}
        size={0.5}
        speed={0.2}
        color={theme === "dark" ? "#4488ff" : "#4466ff"} // Changed to blue to match theme
      />
    </group>
  )
}

interface ContainerVisualizationProps {
  containerId?: string
}

export function ContainerVisualization({ containerId }: ContainerVisualizationProps) {
  const [wireframe, setWireframe] = useState(false)
  const [zoom, setZoom] = useState(10)
  const { theme } = useTheme()
  const [containerData, setContainerData] = useState<any>(null)
  const [itemsData, setItemsData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchContainerData() {
      if (!containerId) return

      try {
        setLoading(true)
        const response = await containersAPI.getById(containerId)
        setContainerData(response.container)
        setItemsData(response.items)
      } catch (error) {
        console.error("Error fetching container data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContainerData()
  }, [containerId])

  const handleZoomIn = () => setZoom((prev) => Math.max(prev - 2, 6))
  const handleZoomOut = () => setZoom((prev) => Math.min(prev + 2, 16))
  const handleReset = () => setZoom(10)

  return (
    <div className="relative h-full w-full">
      <Canvas camera={{ position: [zoom, zoom, zoom], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Container containerId={containerId} containerData={containerData} itemsData={itemsData} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          <Environment preset={theme === "dark" ? "night" : "city"} />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setWireframe(!wireframe)}
          title={wireframe ? "Hide wireframe" : "Show wireframe"}
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 text-space-blue"
        >
          {wireframe ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomIn}
          title="Zoom in"
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 text-space-blue"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomOut}
          title="Zoom out"
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 text-space-blue"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleReset}
          title="Reset view"
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 text-space-blue"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
