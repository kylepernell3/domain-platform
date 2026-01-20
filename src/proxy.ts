import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For now, just allow all requests through
  // We'll add authentication later
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
