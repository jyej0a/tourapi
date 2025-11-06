import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk middleware (최소 설정)
// 세션 관리를 위해 필요하지만, 인증 보호는 각 페이지에서 처리
export default clerkMiddleware();

export const config = {
  // 최소한의 경로만 처리하여 Edge Runtime 부하 감소
  matcher: [
    // API routes만 처리 (페이지는 제외)
    "/(api|trpc)(.*)",
  ],
};

