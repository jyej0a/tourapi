import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Clerk 미들웨어 설정
 * 
 * Next.js 15 + Clerk 6.x 버전에 맞춘 설정
 * - 인증이 필요한 경로를 보호
 * - 공개 경로는 그대로 통과
 */

// 인증이 필요한 경로 정의 (선택사항)
// 현재는 모든 경로를 공개로 설정
const isProtectedRoute = createRouteMatcher([
  // 필요시 여기에 보호할 경로 추가
  // '/bookmarks(.*)',
  // '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // 인증이 필요한 경로 체크 (현재는 비활성화)
  // if (isProtectedRoute(req)) {
  //   await auth.protect();
  // }

  // 모든 요청을 그대로 통과
  return NextResponse.next();
});

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    // 정적 파일과 API 라우트 제외
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

