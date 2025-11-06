import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 인증이 필요한 경로 정의
const isProtectedRoute = createRouteMatcher([
  '/bookmarks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // 인증이 필요한 경로만 보호
    if (isProtectedRoute(req)) {
      const { userId } = await auth();
      
      // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
      if (!userId) {
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(signInUrl);
      }
    }
  } catch (error) {
    // 오류 발생 시 로깅
    console.error('Middleware error:', error);
    // 오류가 발생해도 요청은 계속 진행
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
  // Node.js 런타임 사용 (Edge Runtime 제한 우회)
  runtime: 'nodejs',
};
