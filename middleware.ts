import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Clerk를 사용하지 않는 최소 middleware
// 파일은 존재해야 하므로 404 오류 방지
// 실제 인증은 각 페이지와 API route에서 처리
export function middleware(request: NextRequest) {
  try {
    // 아무것도 하지 않고 요청을 그대로 통과
    return NextResponse.next();
  } catch (error) {
    // 오류 발생 시에도 요청을 통과시킴
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// matcher를 특정 경로로만 제한
export const config = {
  matcher: ['/api/:path*'],
};
