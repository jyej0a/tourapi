/**
 * @file next.config.ts
 * @description Next.js 설정 파일
 *
 * 이 파일은 Next.js 애플리케이션의 설정을 정의합니다.
 *
 * 주요 설정:
 * 1. 이미지 최적화: 외부 도메인 이미지 로드 허용
 * 2. 이미지 포맷 최적화: WebP, AVIF 지원
 * 3. 이미지 크기 제한: 불필요한 대용량 이미지 로드 방지
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/next-config-js/images} - Next.js 이미지 설정 문서
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 외부 이미지 도메인 허용
    remotePatterns: [
      // Clerk 인증 이미지
      { hostname: "img.clerk.com" },
      // 한국관광공사 API 이미지 도메인
      { hostname: "api.visitkorea.or.kr" },
      { hostname: "tong.visitkorea.or.kr" },
      { hostname: "www.visitkorea.or.kr" },
      { hostname: "cdn.visitkorea.or.kr" },
      // 기타 한국관광공사 관련 도메인
      { hostname: "korean.visitkorea.or.kr" },
    ],
    // 이미지 포맷 최적화 (WebP, AVIF 우선)
    formats: ["image/avif", "image/webp"],
    // 이미지 크기 제한 (과도한 대용량 이미지 방지)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 최소 이미지 최적화 (성능 향상)
    minimumCacheTTL: 60,
  },
  // Edge Runtime 호환성 설정
  serverExternalPackages: ['@clerk/nextjs'],
  // Edge Runtime 호환성을 위한 실험적 설정
  experimental: {
    serverComponentsExternalPackages: ['@clerk/nextjs'],
  },
  // Webpack 설정: Edge Runtime에서 지원되지 않는 모듈 외부화
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Edge Runtime에서 문제가 되는 Clerk 모듈을 외부화
      config.externals = config.externals || [];
      config.externals.push({
        '@clerk/shared/buildAccountsBaseUrl': 'commonjs @clerk/shared/buildAccountsBaseUrl',
      });
    }
    return config;
  },
  // 빌드 시 테스트 페이지 제외 (선택사항)
  // 실제로는 각 페이지의 dynamic = 'force-dynamic'으로 처리됨
};

export default nextConfig;
