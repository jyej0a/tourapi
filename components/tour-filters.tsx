/**
 * @file tour-filters.tsx
 * @description 관광지 필터 컴포넌트
 *
 * 이 컴포넌트는 지역과 관광 타입으로 관광지를 필터링하는 UI를 제공합니다.
 *
 * 주요 기능:
 * 1. 지역 필터 (시/도 단위 선택)
 * 2. 관광 타입 필터 (8가지 타입 선택)
 * 3. 필터 변경 시 URL searchParams 업데이트
 * 4. "전체" 옵션 제공
 *
 * 핵심 구현 로직:
 * - Client Component로 필터 상태 관리
 * - URL searchParams를 Single Source of Truth로 사용
 * - 필터 변경 시 router.push()로 URL 업데이트하여 Server Component 재렌더링 유도
 * - 반응형 레이아웃 (모바일: 세로, 데스크톱: 가로)
 *
 * @dependencies
 * - components/ui/select.tsx: Select 컴포넌트
 * - lib/types/tour.ts: AreaCode, CONTENT_TYPE
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
import { CONTENT_TYPE } from '@/lib/types/tour';
import type { AreaCode } from '@/lib/types/tour';

/**
 * 관광 타입 옵션
 * 주의: Select.Item은 빈 문자열을 value로 사용할 수 없으므로 "all"을 사용
 */
const CONTENT_TYPE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: CONTENT_TYPE.TOURIST_SPOT, label: '관광지' },
  { value: CONTENT_TYPE.CULTURAL_FACILITY, label: '문화시설' },
  { value: CONTENT_TYPE.FESTIVAL, label: '축제/행사' },
  { value: CONTENT_TYPE.TRAVEL_COURSE, label: '여행코스' },
  { value: CONTENT_TYPE.LEISURE_SPORTS, label: '레포츠' },
  { value: CONTENT_TYPE.ACCOMMODATION, label: '숙박' },
  { value: CONTENT_TYPE.SHOPPING, label: '쇼핑' },
  { value: CONTENT_TYPE.RESTAURANT, label: '음식점' },
] as const;

/**
 * "전체" 옵션을 나타내는 특별한 값
 */
const ALL_VALUE = 'all';

interface TourFiltersProps {
  areaCodes: AreaCode[];
}

/**
 * 관광지 필터 컴포넌트
 */
export function TourFilters({ areaCodes }: TourFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 필터 값 가져오기
  // URL에 값이 없으면 "all" (전체)로 표시
  const currentAreaCode = searchParams.get('areaCode') || ALL_VALUE;
  const currentContentTypeId = searchParams.get('contentTypeId') || ALL_VALUE;

  /**
   * 필터 변경 핸들러
   */
  const handleFilterChange = (
    filterType: 'areaCode' | 'contentTypeId',
    value: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    // "all" 값이면 파라미터 제거 (전체 선택)
    if (value === ALL_VALUE) {
      params.delete(filterType);
    } else {
      params.set(filterType, value);
    }

    // pageNo는 필터 변경 시 1로 리셋
    params.delete('pageNo');

    // URL 업데이트
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      {/* 지역 필터 */}
      <div className="flex items-center gap-2">
        <label htmlFor="area-filter" className="text-sm font-medium whitespace-nowrap">
          지역:
        </label>
        <Select
          value={currentAreaCode}
          onValueChange={(value) => handleFilterChange('areaCode', value)}
        >
          <SelectTrigger
            id="area-filter"
            className="w-[180px] sm:w-[200px]"
          >
            <SelectValue placeholder="지역 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>전체</SelectItem>
            {areaCodes.map((area) => (
              <SelectItem key={area.code} value={area.code}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 관광 타입 필터 */}
      <div className="flex items-center gap-2">
        <label htmlFor="type-filter" className="text-sm font-medium whitespace-nowrap">
          타입:
        </label>
        <Select
          value={currentContentTypeId}
          onValueChange={(value) => handleFilterChange('contentTypeId', value)}
        >
          <SelectTrigger
            id="type-filter"
            className="w-[180px] sm:w-[200px]"
          >
            <SelectValue placeholder="타입 선택" />
          </SelectTrigger>
          <SelectContent>
            {CONTENT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
