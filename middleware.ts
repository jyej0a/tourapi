import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk 기본 middleware (세션 관리용)
// 인증 보호는 각 페이지에서 처리
// Edge Runtime에서 실행 (기본값)
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

