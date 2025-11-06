/**
 * @file tour-list.tsx
 * @description 관광지 목록 컴포넌트
 *
 * 이 컴포넌트는 관광지 목록을 그리드 레이아웃으로 표시합니다.
 *
 * 주요 기능:
 * 1. 관광지 카드 그리드 레이아웃 (반응형)
 * 2. 로딩 상태 표시 (스켈레톤 UI)
 * 3. 빈 목록 처리
 * 4. 에러 상태 처리
 *
 * 핵심 구현 로직:
 * - 반응형 그리드: 모바일(1열), 태블릿(2열), 데스크톱(3열)
 * - 로딩 중에는 TourCardSkeleton으로 플레이스홀더 표시
 * - 빈 목록일 때 안내 메시지 표시
 *
 * @dependencies
 * - components/tour-card.tsx: TourCard 컴포넌트
 * - components/ui/skeleton.tsx: TourCardSkeleton
 * - lib/types/tour.ts: TourItem 타입
 */

import { TourCard } from './tour-card';
import { TourCardSkeleton } from '@/components/ui/skeleton';
import type { TourItem } from '@/lib/types/tour';

interface TourListProps {
  tours: TourItem[];
  isLoading?: boolean;
  error?: string | null;
  isEmptySearch?: boolean;
  searchKeyword?: string;
}

/**
 * 관광지 목록 컴포넌트
 */
export function TourList({
  tours,
  isLoading = false,
  error,
  isEmptySearch = false,
  searchKeyword,
}: TourListProps) {
  // 에러 상태
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-destructive mb-2">
          데이터를 불러오는 중 오류가 발생했습니다
        </p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <TourCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // 빈 목록
  if (tours.length === 0) {
    // 검색 결과가 없을 때
    if (isEmptySearch && searchKeyword) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground mb-2">
            <span className="font-semibold">"{searchKeyword}"</span>에 대한 검색 결과가 없습니다
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            다른 키워드로 검색하거나 필터를 변경해보세요.
          </p>
        </div>
      );
    }

    // 일반 필터 결과가 없을 때
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground mb-2">
          관광지를 찾을 수 없습니다
        </p>
        <p className="text-sm text-muted-foreground">
          다른 지역이나 관광 타입을 선택해보세요.
        </p>
      </div>
    );
  }

  // 목록 표시
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <TourCard key={tour.contentid} tour={tour} />
      ))}
    </div>
  );
}

