"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react"
import { authAPI } from "@/lib/api"

export function TestDbConnection() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
  } | null>(null)

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await authAPI.testConnection()
      setResult(response)
    } catch (error) {
      console.error("Connection test error:", error)
      setResult({
        success: false,
        message: "Failed to test connection",
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Connection Test
        </CardTitle>
        <CardDescription>Test the connection to your MongoDB database</CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
            {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{result.success ? "Connection Successful" : "Connection Failed"}</AlertTitle>
            <AlertDescription>
              {result.message}
              {result.error && <div className="mt-2 text-xs opacity-80">Error details: {result.error}</div>}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={testConnection} disabled={loading} className="w-full">
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Test Connection
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
