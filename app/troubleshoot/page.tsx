"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestDbConnection } from "@/components/test-db-connection"
import { SpaceBackground } from "@/components/space-background"
import { Database, Server, ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"

export default function TroubleshootPage() {
  const [envVars, setEnvVars] = useState({
    MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Not Set",
    JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not Set",
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || "Not Set",
  })

  return (
    <div className="relative min-h-screen bg-background">
      <SpaceBackground />

      <div className="container relative z-10 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Troubleshooting</h1>
            <p className="text-muted-foreground">Diagnose and fix issues with your application</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="database">
          <TabsList className="mb-4">
            <TabsTrigger value="database">
              <Database className="mr-2 h-4 w-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="api">
              <Server className="mr-2 h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="config">
              <Settings className="mr-2 h-4 w-4" />
              Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="database" className="space-y-4">
            <TestDbConnection />

            <Card>
              <CardHeader>
                <CardTitle>Database Troubleshooting Steps</CardTitle>
                <CardDescription>Follow these steps to resolve database connection issues</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">1. Verify MongoDB URI</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure your MONGODB_URI environment variable is correctly set and follows this format:
                    <code className="ml-2 rounded bg-muted px-1 py-0.5">
                      mongodb+srv://username:password@cluster.mongodb.net/database
                    </code>
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">2. Check Network Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify that your MongoDB Atlas cluster has network access rules that allow connections from your
                    application's IP address.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">3. Validate Database User</h3>
                  <p className="text-sm text-muted-foreground">
                    Confirm that the database user has the correct permissions to read and write to the database.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">4. Check Database Name</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure the database name in your connection string is correct and exists in your MongoDB cluster.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Check your API endpoint configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">1. Verify API Base URL</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure your NEXT_PUBLIC_API_BASE environment variable is correctly set. For local development, this
                    can be empty or set to http://localhost:3000.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">2. Check Network Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Use your browser's developer tools to inspect network requests. Look for failed requests and check
                    the response status codes and error messages.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">3. CORS Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    If you see CORS errors in the console, ensure your API is configured to accept requests from your
                    frontend domain.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">4. API Route Implementation</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify that your API routes are correctly implemented and are handling requests properly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>Check the status of your environment variables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3">
                      <p className="text-sm font-medium">MONGODB_URI</p>
                      <p className="text-sm text-muted-foreground">{envVars.MONGODB_URI}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-sm font-medium">JWT_SECRET</p>
                      <p className="text-sm text-muted-foreground">{envVars.JWT_SECRET}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-sm font-medium">NEXT_PUBLIC_API_BASE</p>
                      <p className="text-sm text-muted-foreground">{envVars.NEXT_PUBLIC_API_BASE}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Environment Variable Setup</h3>
                    <p className="text-sm text-muted-foreground">
                      Ensure you have a .env.local file in your project root with the following variables:
                    </p>
                    <pre className="rounded bg-muted p-2 text-xs">
                      MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database{"\n"}
                      JWT_SECRET=your-secret-key-change-this-in-production{"\n"}
                      NEXT_PUBLIC_API_BASE=http://localhost:3000 # For local development
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
