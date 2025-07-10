"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Box,
  LayoutDashboard,
  Package,
  Search,
  Trash2,
  Clock,
  HelpCircle,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  UserPlus,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { AnimatedBorder, AnimatedGlow } from "@/components/ui/animated-border"
import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "@/components/auth/auth-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { initMockData } from "@/lib/mock-data"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Search & Retrieve",
    href: "/search",
    icon: Search,
  },
  {
    title: "Waste Management",
    href: "/waste",
    icon: Trash2,
  },
  {
    title: "Time Simulation",
    href: "/simulation",
    icon: Clock,
  },
  {
    title: "About & Help",
    href: "/about",
    icon: HelpCircle,
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, logout, isAuthenticated, isAnonymous, loading, setShowAuthModal } = useAuth()
  const router = useRouter()

  // Initialize mock data on first render
  useEffect(() => {
    initMockData()
  }, [])

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show nothing while checking authentication
  if (loading) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Auth Modal */}
      <AuthModal />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <AnimatedGlow glowColor="space-blue" glowSize="sm" glowOpacity={0.2}>
              <Box className="h-6 w-6 text-space-blue transition-transform duration-300 group-hover:scale-110" />
            </AnimatedGlow>
            <span className="text-lg font-bold font-space bg-gradient-to-r from-space-blue to-space-purple bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
              StellarVault
            </span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300",
                pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
              style={{
                transitionDelay: `${index * 50}ms`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateX(-10px)",
              }}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  pathname === item.href && "animate-pulse-slow",
                )}
              />
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center justify-between">
            <AnimatedBorder animationType="pulse" pulseColor="space-blue" borderWidth={1}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative overflow-hidden"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 animate-rotate-slow" />
                ) : (
                  <Moon className="h-5 w-5 animate-pulse-slow" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </AnimatedBorder>

            {isAnonymous ? (
              <Button variant="outline" size="sm" className="gap-2 group" onClick={() => setShowAuthModal(true)}>
                <UserPlus className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
                <span>Sign Up</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 group"
                onClick={() => {
                  logout()
                }}
              >
                <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                <span>Logout</span>
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="flex h-16 items-center justify-between border-b px-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <div className="flex items-center gap-4">
            <AnimatedGlow glowColor="space-purple" glowSize="sm" glowOpacity={0.2}>
              <div className="relative h-8 w-8 rounded-full bg-muted overflow-hidden">
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "AS"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-space-blue/20 to-space-purple/20 animate-rotate-slow"></div>
              </div>
            </AnimatedGlow>
            <span className="text-sm font-medium">{user?.name || "Anonymous User"}</span>

            {isAnonymous && (
              <Button variant="outline" size="sm" className="ml-2 gap-1" onClick={() => setShowAuthModal(true)}>
                <User className="h-3 w-3" />
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </header>

        {/* Anonymous user banner */}
        {isAnonymous && (
          <Alert className="m-4 bg-space-blue/10 border-space-blue">
            <AlertDescription className="flex items-center justify-between">
              <span>You're using the app as a guest. Sign up to save your progress and access all features.</span>
              <Button size="sm" className="bg-space-blue hover:bg-space-blue/90" onClick={() => setShowAuthModal(true)}>
                Sign Up Now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
