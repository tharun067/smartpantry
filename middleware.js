import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
    const token = await getToken({req:request,secret:process.env.NEXTAUTH_SECRET});
    
    // Get the pathname of the reques

    const path = request.nextUrl.pathname;

    // Define protected routes
    const protectedPaths = [
        '/dashboard',
        '/shopping-list',
        '/notifications',
        '/household',
        '/settings',
        '/help',
    ];

    // Define authentication routes
    const authRoutes = ['/login','/register'];

    // Check if the path is protected
    const isProtectedPath = protectedPaths.some(protectedPath => path.startsWith(protectedPath));

    // Check if the path is an auth route
    const isAuthRoute = authRoutes.some(authRoute =>path === authRoute);

    // If the user is on a protected routeand not authenticated, redirect to login
    if (isProtectedPath && !token){
        return NextResponse.redirect(new URL('/login',request.url));
    }

    // If the user is authenticated and trying to access an auth route, redirect to dashboard
    if(isAuthRoute && token){
        return NextResponse.redirect(new URL('/dashboard',request.url));
    }
    return NextResponse.next();
}

// See 'Matching Paths' below

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/shopping-list/:path*',
        '/notifications/:path*',
        '/household/:path*',
        '/settings/:path*',
        '/help/:path*',
        '/login',
        '/register',
    ],
};