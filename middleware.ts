import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk 기본 middleware (최소 설정)
// Edge Runtime에서 실행되지만, 최신 Clerk 버전은 호환성 개선됨
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

