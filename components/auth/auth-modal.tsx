"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { useAuth } from "@/contexts/auth-context"

export function AuthModal() {
  const { showAuthModal, setShowAuthModal } = useAuth()
  const [activeTab, setActiveTab] = useState("login")

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>Please log in or create an account to continue.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <LoginForm />
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <button type="button" className="text-primary underline" onClick={() => setActiveTab("register")}>
                Create an account
              </button>
            </div>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <RegisterForm />
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <button type="button" className="text-primary underline" onClick={() => setActiveTab("login")}>
                Log in
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
