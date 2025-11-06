import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Clerk를 사용하지 않는 최소 middleware
// 파일은 존재해야 하므로 404 오류 방지
// 실제 인증은 각 페이지와 API route에서 처리
export function middleware(request: NextRequest) {
  // 아무것도 하지 않고 요청을 그대로 통과
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

