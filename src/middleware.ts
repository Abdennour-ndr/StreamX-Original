import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow all requests temporarily
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 