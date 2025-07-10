import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// We're not going to protect any routes - all routes are accessible
export async function middleware(req: NextRequest) {
  // Always allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
