import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define routes that require authentication
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/api/generate(.*)']);
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/legal(.*)', '/api/webhook(.*)']);

// 🚫 Blokirane države: Indija, Pakistan, Bangladeš, Nigerija, Indonezija, Egipat, Vijetnam, Filipini, Alžir, Liban, Brazil
const BLOCKED_COUNTRIES = ['IN', 'PK', 'BD', 'NG', 'ID', 'EG', 'VN', 'PH', 'DZ', 'LB', 'BR'];

export default clerkMiddleware(async (auth, req) => {
  // 1. Geo-Blocking logika (Poboljšana detekcija)
  // Čitamo iz headera 'x-vercel-ip-country' jer je to standard na Vercelu
  const country = req.headers.get('x-vercel-ip-country') || (req as any).geo?.country;
  
  console.log(`Geo-Block Check: Country=${country} Path=${req.nextUrl.pathname}`);
  
  if (country && BLOCKED_COUNTRIES.includes(country)) {
    return new NextResponse('Access Denied from your country.', { status: 403 });
  }

  const { userId } = await auth();

  // Redirect authenticated users from landing page to dashboard
  if (userId && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
