/**
 * @file tour-sort.tsx
 * @description 관광지 정렬 컴포넌트
 *
 * 이 컴포넌트는 관광지 목록의 정렬 방식을 선택하는 UI를 제공합니다.
 *
 * 주요 기능:
 * 1. 정렬 옵션 선택 (최신순, 이름순)
 * 2. URL searchParams에 sortBy 추가
 * 3. 정렬 변경 시 URL 업데이트
 *
 * 핵심 구현 로직:
 * - Client Component로 정렬 상태 관리
 * - URL searchParams를 Single Source of Truth로 사용
 * - 정렬 변경 시 router.push()로 URL 업데이트하여 Server Component 재렌더링 유도
 *
 * @dependencies
 * - components/ui/select.tsx: Select 컴포넌트
 * - next/navigation: useRouter, useSearchParams
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * 정렬 옵션
 */
const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' }, // modifiedtime 내림차순
  { value: 'name', label: '이름순' }, // title 가나다순
] as const;

/**
 * 기본 정렬 값
 */
const DEFAULT_SORT = 'latest';

/**
 * 관광지 정렬 컴포넌트
 */
export function TourSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 정렬 값 가져오기 (URL에서)
  const currentSort = searchParams.get('sortBy') || DEFAULT_SORT;

  /**
   * 정렬 변경 핸들러
   */
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // 기본값이면 파라미터 제거
    if (value === DEFAULT_SORT) {
      params.delete('sortBy');
    } else {
      params.set('sortBy', value);
    }

    // pageNo는 정렬 변경 시 1로 리셋 (선택 사항)
    // 정렬만 변경하고 현재 페이지 유지하려면 아래 줄 제거
    // params.delete('pageNo');

    // URL 업데이트
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <label htmlFor="sort-filter" className="text-sm font-medium whitespace-nowrap">
        정렬:
      </label>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger
          id="sort-filter"
          className="w-[140px] sm:w-[160px]"
        >
          <SelectValue placeholder="정렬 선택" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

