/**
 * @file page.tsx
 * @description 관광지 상세 페이지
 *
 * 이 페이지는 관광지의 상세 정보를 표시합니다.
 *
 * 주요 기능:
 * 1. 관광지 기본 정보 표시 (이름, 이미지, 주소, 전화번호 등)
 * 2. 관광지 운영 정보 표시 (운영시간, 요금 등)
 * 3. 지도 섹션 (관광지 위치 표시)
 * 4. 공유 및 북마크 기능
 * 5. Open Graph 메타태그 동적 생성 (SEO 최적화)
 *
 * 핵심 구현 로직:
 * - Next.js 15 App Router의 동적 라우팅 사용
 * - Server Component로 데이터 fetching
 * - API Route를 통해 한국관광공사 API 호출
 * - 섹션별로 컴포넌트 분리 (기본 정보, 운영 정보, 지도 등)
 * - generateMetadata로 동적 메타태그 생성
 *
 * @dependencies
 * - app/api/tour/detail/[contentId]/route.ts: 상세 정보 API
 * - components/tour-detail/: 상세 페이지 컴포넌트들
 * - next/navigation: 뒤로가기 기능
 * - lucide-react: 아이콘
 * - next/metadata: 메타데이터 생성
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DetailInfo } from '@/components/tour-detail/detail-info';
import { DetailIntro } from '@/components/tour-detail/detail-intro';
import { DetailGallery } from '@/components/tour-detail/detail-gallery';
import { ShareButton } from '@/components/tour-detail/share-button';
import { BookmarkButton } from '@/components/bookmarks/bookmark-button';
import {
  getTourDetail,
  getTourIntro,
  getTourImages,
} from '@/lib/api/tour-api';
import type { TourDetail } from '@/lib/types/tour';

interface PageProps {
  params: Promise<{ contentId: string }>;
}

/**
 * 기본 이미지 URL (이미지가 없을 때 사용)
 */
const DEFAULT_OG_IMAGE = '/og-image.png';

/**
 * 기본 도메인 URL (환경변수 또는 기본값)
 */
function getBaseUrl(): string {
  // 환경변수에서 가져오기 (Vercel 배포 시 자동 설정)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  // 로컬 개발 환경
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // 기본값
  return 'http://localhost:3000';
}

/**
 * Open Graph 메타태그 생성
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { contentId } = await params;

  // contentId 유효성 검사
  if (!contentId || contentId.trim() === '') {
    return {
      title: '관광지 상세',
      description: '관광지 상세 정보를 확인하세요.',
    };
  }

  // API 호출하여 상세 정보 가져오기
  let detail: TourDetail | null = null;
  try {
    detail = await getTourDetail(contentId);
  } catch (error) {
    console.error('메타데이터 생성 중 상세 정보 조회 에러:', error);
    // 에러 발생 시 기본 메타데이터 반환
    return {
      title: '관광지 상세',
      description: '관광지 상세 정보를 확인하세요.',
    };
  }

  // 데이터가 없으면 기본 메타데이터 반환
  if (!detail) {
    return {
      title: '관광지 상세',
      description: '관광지 상세 정보를 확인하세요.',
    };
  }

  // URL 생성
  const pageUrl = `${getBaseUrl()}/places/${contentId}`;

  // 이미지 URL 처리
  const imageUrl = detail.firstimage || detail.firstimage2 || DEFAULT_OG_IMAGE;
  // 외부 이미지는 절대 URL, 로컬 이미지는 도메인 포함 절대 URL
  const absoluteImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${getBaseUrl()}${imageUrl}`;

  // 설명 처리 (100자 이내)
  const description = detail.overview
    ? detail.overview.substring(0, 100).replace(/\s+/g, ' ').trim() + '...'
    : `${detail.title}의 상세 정보를 확인하세요.`;

  return {
    title: detail.title,
    description,
    openGraph: {
      title: detail.title,
      description,
      url: pageUrl,
      siteName: 'My Trip',
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: detail.title,
        },
      ],
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: detail.title,
      description,
      images: [absoluteImageUrl],
    },
  };
}

/**
 * 관광지 상세 페이지 컴포넌트
 */
export default async function PlaceDetailPage({ params }: PageProps) {
  const { contentId } = await params;

  // contentId 유효성 검사
  if (!contentId || contentId.trim() === '') {
    notFound();
  }

  // API 호출하여 상세 정보 가져오기
  let detail = null;
  try {
    detail = await getTourDetail(contentId);
  } catch (error) {
    console.error('상세 정보 조회 에러:', error);
    notFound();
  }

  // 데이터가 없으면 404
  if (!detail) {
    notFound();
  }

  // 운영 정보 및 이미지 목록 가져오기 (비동기 병렬 처리)
  let intro = null;
  let images: Awaited<ReturnType<typeof getTourImages>> = [];
  try {
    [intro, images] = await Promise.all([
      getTourIntro(contentId, detail.contenttypeid).catch(() => null),
      getTourImages(contentId).catch(() => []),
    ]);
  } catch (error) {
    console.error('운영 정보 또는 이미지 조회 에러:', error);
    // 에러가 발생해도 페이지는 표시하되, 해당 섹션만 비워둠
  }

  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* 헤더 영역 - 뒤로가기 버튼 */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">뒤로가기</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto py-12 lg:py-20">
        <div className="px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* 공유 및 북마크 버튼 (헤더 영역) */}
        <div className="mb-6 flex justify-end gap-2">
          <BookmarkButton contentId={contentId} />
          <ShareButton />
        </div>

        {/* 섹션 1: 기본 정보 섹션 */}
        <section className="mb-12">
          <DetailInfo detail={detail} />
        </section>

        {/* 섹션 2: 운영 정보 섹션 */}
        {intro && (
          <section className="mb-12">
            <DetailIntro intro={intro} />
          </section>
        )}

        {/* 섹션 3: 지도 섹션 (예정) */}
        <section className="mb-12">
          <div className="border-b pb-4 mb-6">
            <h2 className="text-2xl font-semibold">위치 정보</h2>
          </div>
          <div className="text-muted-foreground">
            <p>지도 섹션 (Phase 3.3에서 구현 예정)</p>
          </div>
        </section>

        {/* 섹션 4: 이미지 갤러리 섹션 */}
        {(images.length > 0 || detail.firstimage || detail.firstimage2) && (
          <section className="mb-12">
            <DetailGallery
              images={images}
              defaultImage={detail.firstimage || detail.firstimage2}
            />
          </section>
        )}
        </div>
      </main>
    </div>
  );
}

