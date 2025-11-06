/**
 * @file tour-card.tsx
 * @description 관광지 카드 컴포넌트
 *
 * 이 컴포넌트는 관광지 정보를 카드 형태로 표시합니다.
 *
 * 주요 기능:
 * 1. 관광지 썸네일 이미지 표시 (없으면 기본 이미지)
 * 2. 관광지명, 주소 표시
 * 3. 관광 타입 뱃지 표시
 * 4. 클릭 시 상세페이지로 이동
 *
 * 핵심 구현 로직:
 * - Next.js Image 컴포넌트로 이미지 최적화
 * - Link 컴포넌트로 상세페이지 라우팅
 * - 관광 타입 ID를 한글 이름으로 변환
 *
 * @dependencies
 * - lib/types/tour.ts: TourItem 타입
 * - components/ui/card.tsx: Card 컴포넌트
 * - next/image: 이미지 최적화
 * - next/link: 클라이언트 사이드 라우팅
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CONTENT_TYPE } from '@/lib/types/tour';
import type { TourItem } from '@/lib/types/tour';

/**
 * 관광 타입 ID를 한글 이름으로 변환
 */
function getContentTypeName(contentTypeId: string): string {
    const typeMap: Record<string, string> = {
        [CONTENT_TYPE.TOURIST_SPOT]: '관광지',
        [CONTENT_TYPE.CULTURAL_FACILITY]: '문화시설',
        [CONTENT_TYPE.FESTIVAL]: '축제/행사',
        [CONTENT_TYPE.TRAVEL_COURSE]: '여행코스',
        [CONTENT_TYPE.LEISURE_SPORTS]: '레포츠',
        [CONTENT_TYPE.ACCOMMODATION]: '숙박',
        [CONTENT_TYPE.SHOPPING]: '쇼핑',
        [CONTENT_TYPE.RESTAURANT]: '음식점',
    };

    return typeMap[contentTypeId] || '기타';
}

/**
 * 기본 이미지 URL (이미지가 없을 때 사용)
 */
const DEFAULT_IMAGE = '/logo.png';

interface TourCardProps {
    tour: TourItem;
    /**
     * 북마크 날짜 (선택 사항, 북마크 목록에서 사용)
     */
    bookmarkDate?: string;
}

export function TourCard({ tour, bookmarkDate }: TourCardProps) {
    const imageUrl = tour.firstimage || tour.firstimage2 || DEFAULT_IMAGE;
    const contentTypeName = getContentTypeName(tour.contenttypeid);
    const address = tour.addr2 ? `${tour.addr1} ${tour.addr2}` : tour.addr1;

    return (
        <Link href={`/places/${tour.contentid}`} className="block h-full">
            <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer overflow-hidden p-0">
                {/* 이미지 영역 */}
                <div className="relative w-full h-56 overflow-hidden bg-muted">
                    <Image
                        src={imageUrl}
                        alt={tour.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                <CardHeader className="pb-3 px-6 pt-4">
                    {/* 관광 타입 뱃지 */}
                    <div className="mb-2">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                            {contentTypeName}
                        </span>
                    </div>

                    {/* 관광지명 */}
                    <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
                        {tour.title}
                    </h3>
                </CardHeader>

                <CardContent className="pt-0 px-6 pb-4">
                    {/* 주소 */}
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                        📍 {address}
                    </p>

                    {/* 북마크 날짜 (선택 사항) */}
                    {bookmarkDate && (
                        <p className="text-xs text-muted-foreground">
                            북마크 날짜: {bookmarkDate}
                        </p>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}

