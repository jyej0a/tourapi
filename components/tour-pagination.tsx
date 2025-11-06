/**
 * @file tour-pagination.tsx
 * @description 관광지 목록 페이지네이션 컴포넌트
 *
 * 이 컴포넌트는 관광지 목록의 페이지네이션을 제공합니다.
 *
 * 주요 기능:
 * 1. 페이지 번호 버튼 표시
 * 2. 이전/다음 버튼
 * 3. 현재 페이지 하이라이트
 * 4. 총 페이지 수 표시
 *
 * 핵심 구현 로직:
 * - Client Component로 페이지네이션 상태 관리
 * - URL searchParams를 Single Source of Truth로 사용
 * - 페이지 변경 시 router.push()로 URL 업데이트
 * - 현재 페이지 ± 2개 범위의 페이지 번호 표시
 *
 * @dependencies
 * - components/ui/button.tsx: Button 컴포넌트
 * - next/navigation: useRouter, useSearchParams
 * - lucide-react: ChevronLeft, ChevronRight 아이콘
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TourPaginationProps {
  totalCount: number;
  currentPage: number;
  numOfRows: number;
}

/**
 * 관광지 페이지네이션 컴포넌트
 */
export function TourPagination({
  totalCount,
  currentPage,
  numOfRows,
}: TourPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalCount / numOfRows);

  // 페이지가 없거나 1페이지만 있으면 표시하지 않음
  if (totalPages <= 1) {
    return null;
  }

  /**
   * 페이지 변경 핸들러
   */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (page === 1) {
      params.delete('pageNo');
    } else {
      params.set('pageNo', page.toString());
    }

    // URL 업데이트
    router.push(`/?${params.toString()}`);

    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 표시할 페이지 번호 계산
   * 데스크톱: 현재 페이지 ± 2개 범위
   * 모바일: 현재 페이지 ± 1개 범위 (더 간결하게)
   */
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    // 모바일에서는 더 적은 페이지 표시 (클라이언트 사이드에서 감지 불가하므로 데스크톱 기준)
    const range = 2; // 현재 페이지 좌우로 표시할 페이지 수

    const startPage = Math.max(1, currentPage - range);
    const endPage = Math.min(totalPages, currentPage + range);

    // 시작 페이지가 1이 아니면 1 추가
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push(-1); // 생략 표시
      }
    }

    // 중간 페이지들
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // 끝 페이지가 마지막이 아니면 마지막 추가
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(-1); // 생략 표시
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {/* 페이지 정보 */}
      <p className="text-sm text-muted-foreground">
        전체 {totalCount.toLocaleString()}개 중{' '}
        {Math.min((currentPage - 1) * numOfRows + 1, totalCount).toLocaleString()}-
        {Math.min(currentPage * numOfRows, totalCount).toLocaleString()}개 표시
      </p>

      {/* 페이지네이션 버튼 */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 w-full justify-center">
        {/* 이전 버튼 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="이전 페이지"
          className="flex-shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">이전</span>
        </Button>

        {/* 페이지 번호 버튼들 */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === -1) {
              // 생략 표시
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1 sm:px-2 text-muted-foreground"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <Button
                key={page}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={cn(
                  'min-w-[36px] sm:min-w-[40px] flex-shrink-0',
                  isActive && 'pointer-events-none'
                )}
                aria-label={`${page}페이지로 이동`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* 다음 버튼 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="다음 페이지"
          className="flex-shrink-0"
        >
          <span className="sr-only sm:not-sr-only sm:mr-1">다음</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

