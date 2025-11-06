/**
 * @file page.tsx
 * @description 홈페이지 - 관광지 목록
 *
 * 이 페이지는 관광지 목록을 표시하는 메인 페이지입니다.
 *
 * 주요 기능:
 * 1. 지역/타입 필터 기능
 * 2. 관광지 목록 조회 (필터 적용)
 * 3. 관광지 카드 그리드 레이아웃
 * 4. 로딩 및 에러 상태 처리
 *
 * 핵심 구현 로직:
 * - Server Component로 서버에서 데이터 페칭
 * - URL searchParams로 필터 상태 관리
 * - 기본값: 전체 지역, 전체 타입 (또는 서울, 관광지)
 * - 필터 변경 시 자동으로 데이터 재조회
 *
 * @dependencies
 * - components/tour-list.tsx: TourList 컴포넌트
 * - components/tour-filters.tsx: TourFilters 컴포넌트
 * - lib/api/tour-api.ts: getAreaBasedList, getAreaCodes
 */

import { TourList } from '@/components/tour-list';
import { TourFilters } from '@/components/tour-filters';
import { TourSearch } from '@/components/tour-search';
import { TourSort } from '@/components/tour-sort';
import { TourPagination } from '@/components/tour-pagination';
import { getAreaBasedList, getAreaCodes, searchKeyword } from '@/lib/api/tour-api';
import type { TourItem } from '@/lib/types/tour';

interface HomeProps {
  searchParams: Promise<{
    keyword?: string;
    areaCode?: string;
    contentTypeId?: string;
    sortBy?: string;
    pageNo?: string;
  }>;
}

/**
 * 한국관광공사 API의 modifiedtime 형식을 Date로 변환
 * 형식: "YYYYMMDDHHmmss" (예: "20240101120000")
 * @param modifiedtime 수정일 문자열
 * @returns Date 객체 또는 null
 */
function parseModifiedTime(modifiedtime: string): Date | null {
  if (!modifiedtime || modifiedtime.trim() === '') {
    return null;
  }

  // "YYYYMMDDHHmmss" 형식 파싱
  // 예: "20240101120000" -> 2024-01-01 12:00:00
  if (modifiedtime.length === 14) {
    const year = parseInt(modifiedtime.substring(0, 4), 10);
    const month = parseInt(modifiedtime.substring(4, 6), 10) - 1; // 월은 0부터 시작
    const day = parseInt(modifiedtime.substring(6, 8), 10);
    const hour = parseInt(modifiedtime.substring(8, 10), 10);
    const minute = parseInt(modifiedtime.substring(10, 12), 10);
    const second = parseInt(modifiedtime.substring(12, 14), 10);

    // 유효성 검사
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

    try {
      const date = new Date(year, month, day, hour, minute, second);
      // 유효한 날짜인지 확인
      if (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      ) {
        return date;
      }
    } catch {
      // 파싱 실패
      return null;
    }
  }

  // 일반 Date 형식으로 시도
  try {
    const date = new Date(modifiedtime);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch {
    // 파싱 실패
  }

  return null;
}

/**
 * 관광지 정렬 함수
 * @param tours 정렬할 관광지 배열
 * @param sortBy 정렬 방식 ('latest' | 'name')
 */
function sortTours(tours: TourItem[], sortBy: string): TourItem[] {
  if (!tours || tours.length === 0) {
    return tours;
  }

  // 최신순: modifiedtime 내림차순
  if (sortBy === 'latest') {
    return [...tours].sort((a, b) => {
      const dateA = parseModifiedTime(a.modifiedtime);
      const dateB = parseModifiedTime(b.modifiedtime);

      // 둘 다 날짜가 없으면 순서 유지
      if (!dateA && !dateB) return 0;
      // a만 날짜가 없으면 뒤로
      if (!dateA) return 1;
      // b만 날짜가 없으면 앞으로
      if (!dateB) return -1;

      // 내림차순 정렬 (최신순: 큰 값이 앞으로)
      const timeA = dateA.getTime();
      const timeB = dateB.getTime();
      return timeB - timeA;
    });
  }

  // 이름순: title 가나다순
  if (sortBy === 'name') {
    return [...tours].sort((a, b) => {
      // title이 없으면 처리
      if (!a.title && !b.title) return 0;
      if (!a.title) return 1;
      if (!b.title) return -1;

      // 한글 가나다순 정렬 (오름차순)
      return a.title.localeCompare(b.title, 'ko', { sensitivity: 'base' });
    });
  }

  // 기본값: 원래 순서 유지
  return tours;
}

/**
 * 관광지 목록 조회 (서버 사이드)
 * - 검색 키워드가 있으면 검색 API 호출
 * - 없으면 필터 기반 목록 API 호출
 */
async function getTourList(
  keyword?: string,
  areaCode?: string,
  contentTypeId?: string,
  sortBy: string = 'latest',
  pageNo: number = 1,
) {
  try {
    // 빈 문자열이면 undefined로 전달 (전체 조회)
    const finalAreaCode = areaCode === '' || !areaCode ? undefined : areaCode;
    const finalContentTypeId = contentTypeId === '' || !contentTypeId ? undefined : contentTypeId;
    const finalKeyword = keyword === '' || !keyword ? undefined : keyword?.trim();

    let result;

    // 검색 키워드가 있으면 검색 API 호출
    if (finalKeyword) {
      result = await searchKeyword(
        finalKeyword,
        finalAreaCode,
        finalContentTypeId,
        21, // numOfRows
        pageNo,
      );
    } else {
      // 검색 키워드가 없으면 필터 기반 목록 API 호출
      result = await getAreaBasedList(
        finalAreaCode,
        finalContentTypeId,
        21, // numOfRows
        pageNo,
      );
    }

    // 정렬 적용
    const sortedTours = sortTours(result.items || [], sortBy);

    // 개발 환경에서 정렬 확인 로그
    if (process.env.NODE_ENV === 'development' && sortedTours.length > 0) {
      console.group(`[정렬 확인] ${sortBy === 'latest' ? '최신순' : '이름순'}`);
      console.log('정렬 방식:', sortBy);
      console.log('정렬 전 첫 3개:', result.items?.slice(0, 3).map((t) => ({
        title: t.title.substring(0, 20),
        modifiedtime: t.modifiedtime,
        parsedDate: parseModifiedTime(t.modifiedtime)?.toISOString() || '파싱 실패',
      })));
      console.log('정렬 후 첫 3개:', sortedTours.slice(0, 3).map((t) => ({
        title: t.title.substring(0, 20),
        modifiedtime: t.modifiedtime,
        parsedDate: parseModifiedTime(t.modifiedtime)?.toISOString() || '파싱 실패',
      })));
      console.groupEnd();
    }

    return {
      tours: sortedTours,
      totalCount: result.totalCount || 0,
      error: null,
    };
  } catch (error) {
    console.error('관광지 목록 조회 에러:', error);
    return {
      tours: [],
      totalCount: 0,
      error:
        error instanceof Error
          ? error.message
          : '관광지 목록을 불러오는 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 지역 코드 목록 조회 (서버 사이드)
 */
async function getAreaCodesList() {
  try {
    const areaCodes = await getAreaCodes(50, 1);
    return areaCodes;
  } catch (error) {
    console.error('지역 코드 조회 에러:', error);
    return [];
  }
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const keyword = params.keyword || '';
  // "all" 값은 빈 문자열로 변환 (전체 선택)
  const areaCode = params.areaCode === 'all' ? '' : params.areaCode || '';
  const contentTypeId = params.contentTypeId === 'all' ? '' : params.contentTypeId || '';
  const sortBy = params.sortBy || 'latest'; // 기본값: 최신순
  const pageNo = parseInt(params.pageNo || '1', 10);

  // 병렬로 데이터 조회
  const [tourListResult, areaCodes] = await Promise.all([
    getTourList(keyword, areaCode, contentTypeId, sortBy, pageNo),
    getAreaCodesList(),
  ]);

  return (
    <main className="min-h-[calc(100vh-80px)] py-12 lg:py-20">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* 페이지 헤더 */}
        <div className="mb-12">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 tracking-tight">
            전국 관광지 정보
          </h1>
          <p className="text-muted-foreground text-lg">
            한국관광공사 공공 API를 활용한 관광지 정보 서비스
          </p>
        </div>

        {/* 검색창 */}
        <div className="mb-8">
          <TourSearch />
        </div>

        {/* 필터 및 정렬 */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TourFilters areaCodes={areaCodes} />
          <TourSort />
        </div>

        {/* 검색 결과 개수 표시 */}
        {keyword && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">&quot;{keyword}&quot;</span> 검색 결과{' '}
              {tourListResult.totalCount > 0 && (
                <span className="font-semibold text-foreground">
                  {tourListResult.totalCount.toLocaleString()}개
                </span>
              )}
            </p>
          </div>
        )}

        {/* 관광지 목록 */}
        <TourList
          tours={tourListResult.tours}
          error={tourListResult.error}
          isEmptySearch={keyword && tourListResult.tours.length === 0}
          searchKeyword={keyword}
        />

        {/* 페이지네이션 */}
        {tourListResult.totalCount > 0 && (
          <TourPagination
            totalCount={tourListResult.totalCount}
            currentPage={pageNo}
            numOfRows={21}
          />
        )}
      </div>
    </main>
  );
}
