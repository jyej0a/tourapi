import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Clerk Middleware 설정
 * 
 * API Route에서 auth()와 currentUser()를 사용하려면 clerkMiddleware가 필요합니다.
 * 기본 설정으로 모든 경로에 대해 인증 정보를 제공하지만, 
 * 실제 인증 확인은 각 페이지와 API route에서 처리합니다.
 */
export default clerkMiddleware(async (auth, request: NextRequest) => {
  // 모든 요청을 통과시키고, 인증 정보는 각 route에서 확인
  return NextResponse.next();
});

// matcher 설정 - 모든 경로에 대해 middleware 실행
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
