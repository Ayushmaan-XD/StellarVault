export function validateEnv() {
  // Check if environment variables exist but don't throw errors
  const envVars = {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bkcdqxkxkovmgebvdfaw.supabase.co",
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrY2RxeGt4a292bWdlYnZkZmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTM2OTMsImV4cCI6MjA1OTk2OTY5M30.eSb4qFFtzZJo-HDWmsH9y1Onunyw0hw5mcDGDtFig5w",
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrY2RxeGt4a292bWdlYnZkZmF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDM5MzY5MywiZXhwIjoyMDU5OTY5NjkzfQ.mBjA8BofGudTKoxMVJbHoosF7ACIXkE6QD7R0IBXtA0",
      jwtSecret: process.env.SUPABASE_JWT_SECRET || "pLFkHca90gtYnq7sq2NmD8Z7mmaPHgbQTCwRuRP068/kCCJZBekT7tLDraBxCw+UON0oyVALWFHhu9cYVHgdLg==",
    },
    mongodb: {
      uri: process.env.MONGODB_URI || "",
    },
    jwt: {
      secret: process.env.JWT_SECRET || "default-jwt-secret",
    },
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_BASE || "",
    },
  }

  return envVars
}

// Check if Supabase is configured
export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Check if MongoDB is configured
export function isMongoDBConfigured() {
  return !!process.env.MONGODB_URI
}
