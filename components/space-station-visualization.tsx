"use client"

import { Suspense, useState, useRef, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  Stars,
  Float,
  Sparkles,
  PerspectiveCamera,
  Html,
  useCursor,
} from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, ZoomIn, ZoomOut, Layers, Home } from "lucide-react"
import { useTheme } from "next-themes"
import * as THREE from "three"
import { easing } from "maath"
import { Badge } from "@/components/ui/badge"
import { AnimatedBorder } from "@/components/ui/animated-border"

// Define the station sections
const STATION_SECTIONS = [
  { id: "crew", name: "Crew Quarters", color: "#ff8844" },
  { id: "airlock", name: "Airlock", color: "#44ff88" },
  { id: "lab", name: "Laboratory", color: "#ff4488" },
  { id: "command", name: "Command Center", color: "#4488ff" },
  { id: "storage", name: "Storage Bay", color: "#88ff44" },
]

// Camera controller with smooth transitions
function CameraController({ target, section }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  // Handle section changes with smooth transitions
  useEffect(() => {
    if (section && controlsRef.current) {
      const targetPosition = new THREE.Vector3()

      // Set different positions based on selected section
      switch (section) {
        case "crew":
          targetPosition.set(0, 1.5, 0)
          break
        case "airlock":
          targetPosition.set(0, -1.5, 0)
          break
        case "lab":
          targetPosition.set(0, 0, 2.5)
          break
        case "command":
          targetPosition.set(3, 0, 0)
          break
        case "storage":
          targetPosition.set(-3, 0, 0)
          break
        default:
          // Reset to default view
          targetPosition.set(0, 0, 0)
      }

      // Update controls target with animation
      controlsRef.current.target.lerp(targetPosition, 0.05)
    }
  }, [section])

  return (
    <OrbitControls
      ref={controlsRef}
      target={target}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={3}
      maxDistance={20}
      dampingFactor={0.05}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
    />
  )
}

// Container component with hover effects
function Container({ position, size, color, name, isHighlighted, onClick, utilization = 75 }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { theme } = useTheme()

  useCursor(hovered)

  // Pulse animation for highlighted containers
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Scale animation when highlighted or hovered
      if (isHighlighted || hovered) {
        easing.damp3(meshRef.current.scale, [1.05, 1.05, 1.05], 0.2, delta)
      } else {
        easing.damp3(meshRef.current.scale, [1, 1, 1], 0.2, delta)
      }

      // Rotation animation
      if (isHighlighted) {
        meshRef.current.rotation.y += delta * 0.3
      }
    }
  })

  // Determine color based on utilization
  const utilizationColor = useMemo(() => {
    if (utilization > 80) return "#ff4444"
    if (utilization > 60) return "#ffaa44"
    return color
  }, [utilization, color])

  // Material properties
  const material = useMemo(
    () => ({
      color: new THREE.Color(utilizationColor),
      metalness: 0.7,
      roughness: 0.2,
      transparent: true,
      opacity: isHighlighted ? 0.9 : 0.7,
      emissive: new THREE.Color(isHighlighted ? utilizationColor : "#000000"),
      emissiveIntensity: isHighlighted ? 0.3 : 0,
    }),
    [isHighlighted, utilizationColor],
  )

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial {...material} />

        {/* Container label */}
        <Html position={[0, size[1] / 2 + 0.3, 0]} center distanceFactor={10} occlude>
          <div className="px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium shadow-md transform transition-all duration-200 select-none">
            {name}
            <div className="mt-1 w-full bg-muted rounded-full h-1">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${utilization}%`,
                  backgroundColor: utilizationColor,
                }}
              />
            </div>
          </div>
        </Html>
      </mesh>

      {/* Add items inside container */}
      {Array.from({ length: 3 }).map((_, i) => (
        <Float
          key={i}
          speed={1 + i * 0.2}
          rotationIntensity={0.2}
          floatIntensity={0.3}
          position={[
            (Math.random() - 0.5) * size[0] * 0.5,
            (Math.random() - 0.5) * size[1] * 0.5,
            (Math.random() - 0.5) * size[2] * 0.5,
          ]}
        >
          <mesh>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color={theme === "dark" ? "#ffffff" : "#333333"} metalness={0.5} roughness={0.2} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// Main station component
function SpaceStation({ activeSection, setActiveSection }) {
  const { theme } = useTheme()
  const groupRef = useRef()

  // Add subtle floating animation to the entire station
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05
    }
  })

  // Colors based on theme
  const mainColor = theme === "dark" ? "#888" : "#aaa"
  const solarPanelColor = theme === "dark" ? "#4488ff" : "#77aaff"

  // Container data with utilization percentages
  const containers = [
    {
      id: "crew",
      position: [0, 1.5, 0],
      size: [1.5, 1, 1.5],
      color: STATION_SECTIONS[0].color,
      name: "Crew Quarters",
      utilization: 85,
    },
    {
      id: "airlock",
      position: [0, -1.5, 0],
      size: [1.5, 1, 1.5],
      color: STATION_SECTIONS[1].color,
      name: "Airlock",
      utilization: 45,
    },
    {
      id: "lab",
      position: [0, 0, 2.5],
      size: [1.5, 1, 1.5],
      color: STATION_SECTIONS[2].color,
      name: "Laboratory",
      utilization: 65,
    },
    {
      id: "command",
      position: [3, 0, 0],
      size: [1.8, 1.2, 1.5],
      color: STATION_SECTIONS[3].color,
      name: "Command Center",
      utilization: 30,
    },
    {
      id: "storage",
      position: [-3, 0, 0],
      size: [2, 1.5, 1.8],
      color: STATION_SECTIONS[4].color,
      name: "Storage Bay",
      utilization: 92,
    },
  ]

  return (
    <group ref={groupRef}>
      {/* Main module */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 2, 6, 32]} />
        <meshStandardMaterial color={mainColor} metalness={0.8} roughness={0.2} envMapIntensity={1} />
      </mesh>

      {/* Solar panels with animation */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0, 0, -4]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[8, 0.1, 2]} />
          <meshStandardMaterial color={solarPanelColor} metalness={0.7} roughness={0.2} envMapIntensity={2} />
        </mesh>
      </Float>

      {/* Containers */}
      {containers.map((container) => (
        <Container
          key={container.id}
          position={container.position}
          size={container.size}
          color={container.color}
          name={container.name}
          isHighlighted={activeSection === container.id}
          onClick={() => setActiveSection(container.id === activeSection ? null : container.id)}
          utilization={container.utilization}
        />
      ))}

      {/* Add sparkles for a space effect */}
      <Sparkles count={200} scale={15} size={1.5} speed={0.3} color={theme === "dark" ? "#fff" : "#4466ff"} />
    </group>
  )
}

export function SpaceStationVisualization() {
  const [wireframe, setWireframe] = useState(false)
  const [zoom, setZoom] = useState(8)
  const [activeSection, setActiveSection] = useState(null)
  const [showSections, setShowSections] = useState(false)
  const { theme } = useTheme()

  // Target for camera controls
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), [])

  const handleZoomIn = () => setZoom((prev) => Math.max(prev - 1, 4))
  const handleZoomOut = () => setZoom((prev) => Math.min(prev + 1, 15))
  const handleReset = () => {
    setZoom(8)
    setActiveSection(null)
  }

  return (
    <div className="relative h-full w-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[zoom, zoom, zoom]} fov={45} />
        <CameraController target={target} section={activeSection} />

        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          <SpaceStation activeSection={activeSection} setActiveSection={setActiveSection} />
          <Environment preset={theme === "dark" ? "night" : "city"} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Suspense>
      </Canvas>

      {/* Section selector */}
      {showSections && (
        <div className="absolute top-4 left-4 flex flex-col gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-lg">
          {STATION_SECTIONS.map((section) => (
            <AnimatedBorder
              key={section.id}
              animationType={activeSection === section.id ? "pulse" : "none"}
              pulseColor={section.id}
            >
              <Button
                variant={activeSection === section.id ? "default" : "outline"}
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                style={{
                  backgroundColor: activeSection === section.id ? section.color : "",
                  color: activeSection === section.id ? "#fff" : "",
                  borderColor: section.color,
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: section.color }} />
                <span>{section.name}</span>
                {section.id === "storage" && (
                  <Badge variant="destructive" className="ml-auto">
                    92%
                  </Badge>
                )}
                {section.id === "crew" && (
                  <Badge variant="default" className="ml-auto">
                    85%
                  </Badge>
                )}
              </Button>
            </AnimatedBorder>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setWireframe(!wireframe)}
          title={wireframe ? "Hide wireframe" : "Show wireframe"}
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300"
        >
          {wireframe ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomIn}
          title="Zoom in"
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomOut}
          title="Zoom out"
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleReset}
          title="Reset view"
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300"
        >
          <Home className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setShowSections(!showSections)}
          title={showSections ? "Hide sections" : "Show sections"}
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300"
        >
          <Layers className="h-4 w-4" />
        </Button>
      </div>

      {/* Section info */}
      {activeSection && (
        <div className="absolute bottom-4 right-4 max-w-xs bg-background/80 backdrop-blur-sm p-3 rounded-lg border shadow-lg">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: STATION_SECTIONS.find((s) => s.id === activeSection)?.color,
              }}
            />
            {STATION_SECTIONS.find((s) => s.id === activeSection)?.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {activeSection === "crew" && "Living quarters for astronauts with sleeping pods and personal storage."}
            {activeSection === "airlock" && "Transition chamber for spacewalks and external operations."}
            {activeSection === "lab" && "Scientific research area with specialized equipment."}
            {activeSection === "command" && "Control center with navigation and communication systems."}
            {activeSection === "storage" && "Main cargo storage area for supplies and equipment."}
          </p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs">Space utilization:</span>
            <span className="text-xs font-medium">
              {activeSection === "crew" && "85%"}
              {activeSection === "airlock" && "45%"}
              {activeSection === "lab" && "65%"}
              {activeSection === "command" && "30%"}
              {activeSection === "storage" && "92%"}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-1">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width:
                  activeSection === "crew"
                    ? "85%"
                    : activeSection === "airlock"
                      ? "45%"
                      : activeSection === "lab"
                        ? "65%"
                        : activeSection === "command"
                          ? "30%"
                          : "92%",
                backgroundColor: STATION_SECTIONS.find((s) => s.id === activeSection)?.color,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
