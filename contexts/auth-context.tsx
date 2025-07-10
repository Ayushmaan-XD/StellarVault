"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
  isAnonymous?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role?: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isAnonymous: boolean
  error: string | null
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true)
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token")
        const anonymousUser = localStorage.getItem("anonymousUser")

        if (token) {
          // Try to validate token, but don't force login if it fails
          try {
            const response = await fetch("/api/auth/validate", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })

            if (response.ok) {
              const userData = await response.json()
              setUser(userData.user)
            } else {
              // If token is invalid, use anonymous user
              createAnonymousUser()
            }
          } catch (error) {
            // If validation fails, use anonymous user
            createAnonymousUser()
          }
        } else if (anonymousUser) {
          // Use existing anonymous user
          setUser(JSON.parse(anonymousUser))
        } else {
          // Create new anonymous user
          createAnonymousUser()
        }
      } catch (err) {
        console.error("Auth status check error:", err)
        createAnonymousUser()
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const createAnonymousUser = () => {
    const anonymousId = `anon-${Math.random().toString(36).substring(2, 9)}`
    const anonymousUser = {
      id: anonymousId,
      name: "Guest User",
      email: `guest-${anonymousId}@example.com`,
      role: "guest",
      isAnonymous: true,
    }

    // Save to localStorage
    localStorage.setItem("anonymousUser", JSON.stringify(anonymousUser))

    // Set in state
    setUser(anonymousUser)
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      // For demo purposes, we'll just simulate a successful login
      const mockUser = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        name: email.split("@")[0],
        email: email,
        role: "astronaut",
        isAnonymous: false,
      }

      // Store mock token in localStorage
      localStorage.setItem("token", `mock-token-${mockUser.id}`)

      // Remove anonymous user if exists
      localStorage.removeItem("anonymousUser")

      // Set user data
      setUser(mockUser)

      // Close auth modal if open
      setShowAuthModal(false)

      // Show success toast
      toast({
        title: "Login Successful",
        description: `Welcome, ${mockUser.name}!`,
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Failed to login")

      // Show error toast
      toast({
        title: "Login Failed",
        description: err.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      })

      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, role = "astronaut") => {
    setLoading(true)
    setError(null)

    try {
      // For demo purposes, we'll just simulate a successful registration
      const mockUser = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        name: name,
        email: email,
        role: role,
        isAnonymous: false,
      }

      // Store mock token in localStorage
      localStorage.setItem("token", `mock-token-${mockUser.id}`)

      // Remove anonymous user if exists
      localStorage.removeItem("anonymousUser")

      // Set user data
      setUser(mockUser)

      // Close auth modal if open
      setShowAuthModal(false)

      // Show success toast
      toast({
        title: "Registration Successful",
        description: "Your account has been created.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || "Failed to register")

      // Show error toast
      toast({
        title: "Registration Failed",
        description: err.message || "Could not create account. Please try again.",
        variant: "destructive",
      })

      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Clear token from localStorage
      localStorage.removeItem("token")

      // Create a new anonymous user
      createAnonymousUser()

      // Show success toast
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })

      // Redirect to home page
      router.push("/")
    } catch (err: any) {
      console.error("Logout error:", err)

      // Show error toast
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      })

      // Still create anonymous user even if there's an error
      createAnonymousUser()
      router.push("/")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !user.isAnonymous,
        isAnonymous: !!user?.isAnonymous,
        error,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
