/**
 * @file robots.ts
 * @description robots.txt 파일 생성
 *
 * 이 파일은 검색 엔진 크롤러에게 어떤 페이지를 크롤링할 수 있는지 알려줍니다.
 *
 * 주요 기능:
 * 1. 검색 엔진 크롤러 접근 제어
 * 2. 사이트맵 위치 지정
 * 3. 특정 크롤러별 규칙 설정
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#robots} - Next.js robots.txt 문서
 */

import { MetadataRoute } from 'next';

/**
 * robots.txt 생성
 * 
 * @returns robots.txt 설정
 */
export default function robots(): MetadataRoute.Robots {
  // 기본 URL (환경변수 또는 기본값)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  process.env.NEXT_PUBLIC_VERCEL_URL 
                    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
                    : 'https://example.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // API 라우트는 크롤링 불필요
          '/auth-test/', // 테스트 페이지
          '/storage-test/', // 테스트 페이지
        ],
      },
      // Googlebot 특별 규칙 (필요 시)
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

