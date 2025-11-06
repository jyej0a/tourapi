import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 인증이 필요한 경로 정의
const isProtectedRoute = createRouteMatcher([
  '/bookmarks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // 인증이 필요한 경로만 보호
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
