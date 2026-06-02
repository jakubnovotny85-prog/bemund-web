import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth protection is handled client-side in dashboard page
  // (Supabase JS client stores session in localStorage, not cookies)
  // This middleware is a placeholder for future server-side auth
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
