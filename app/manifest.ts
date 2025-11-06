/**
 * @file manifest.ts
 * @description PWA Manifest 파일 생성
 *
 * 이 파일은 웹 앱을 모바일 기기에 설치할 수 있도록 하는 매니페스트를 생성합니다.
 *
 * 주요 기능:
 * 1. 앱 이름, 아이콘, 테마 설정
 * 2. 시작 화면 설정
 * 3. 디스플레이 모드 설정
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest} - Next.js manifest 문서
 */

import { MetadataRoute } from 'next';

/**
 * manifest.json 생성
 * 
 * @returns PWA manifest 설정
 */
export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  process.env.NEXT_PUBLIC_VERCEL_URL 
                    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
                    : 'https://example.com';

  return {
    name: 'My Trip - 전국 관광지 정보',
    short_name: 'My Trip',
    description: '한국관광공사 공공 API를 활용한 전국 관광지 정보 서비스',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2B7DE9',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['travel', 'tourism', 'lifestyle'],
    lang: 'ko',
    orientation: 'portrait-primary',
  };
}

