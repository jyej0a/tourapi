/**
 * @file sitemap.ts
 * @description sitemap.xml 파일 생성
 *
 * 이 파일은 검색 엔진에게 사이트의 모든 페이지 구조를 알려줍니다.
 *
 * 주요 기능:
 * 1. 정적 페이지 URL 생성 (홈, 북마크 등)
 * 2. 동적 페이지 URL 생성 (관광지 상세 페이지)
 * 3. 페이지 우선순위 및 업데이트 빈도 설정
 *
 * 참고:
 * - 동적 페이지는 많은 수가 있어서 샘플만 포함하거나 제한적으로 생성
 * - 실제 운영 시에는 주요 관광지만 포함하거나, 인기 관광지를 우선으로 포함
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap} - Next.js sitemap 문서
 */

import { MetadataRoute } from 'next';
import { getAreaBasedList } from '@/lib/api/tour-api';

/**
 * 기본 URL 가져오기
 */
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return 'https://example.com';
}

/**
 * sitemap.xml 생성
 * 
 * @returns sitemap 설정
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const currentDate = new Date();

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 동적 페이지: 관광지 상세 페이지
  // 주의: 전체 관광지 목록을 가져오면 매우 많은 페이지가 생성될 수 있음
  // 따라서 샘플만 포함하거나, 인기 관광지만 포함하는 것을 권장
  
  try {
    // 주요 관광지 샘플만 가져오기 (서울 지역, 관광지 타입, 첫 페이지만)
    const tourList = await getAreaBasedList('1', '12', 100, 1); // 서울 지역, 관광지, 100개
    
    const dynamicPages: MetadataRoute.Sitemap = tourList.items.slice(0, 100).map((tour) => ({
      url: `${baseUrl}/places/${tour.contentid}`,
      lastModified: tour.modifiedtime 
        ? parseModifiedTime(tour.modifiedtime) || currentDate
        : currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...dynamicPages];
  } catch (error) {
    console.error('Sitemap 생성 중 에러:', error);
    // 에러 발생 시 정적 페이지만 포함
    return staticPages;
  }
}

/**
 * 한국관광공사 API의 modifiedtime 형식을 Date로 변환
 * 형식: "YYYYMMDDHHmmss" (예: "20240101120000")
 */
function parseModifiedTime(modifiedtime: string): Date | null {
  if (!modifiedtime || modifiedtime.trim() === '' || modifiedtime.length !== 14) {
    return null;
  }

  try {
    const year = parseInt(modifiedtime.substring(0, 4), 10);
    const month = parseInt(modifiedtime.substring(4, 6), 10) - 1;
    const day = parseInt(modifiedtime.substring(6, 8), 10);
    const hour = parseInt(modifiedtime.substring(8, 10), 10);
    const minute = parseInt(modifiedtime.substring(10, 12), 10);
    const second = parseInt(modifiedtime.substring(12, 14), 10);

    if (
      isNaN(year) ||
      isNaN(month) ||
      isNaN(day) ||
      isNaN(hour) ||
      isNaN(minute) ||
      isNaN(second)
    ) {
      return null;
    }

    return new Date(year, month, day, hour, minute, second);
  } catch (error) {
    return null;
  }
}

