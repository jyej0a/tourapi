/**
 * @file tour-api.ts
 * @description 한국관광공사 API 클라이언트
 *
 * 이 파일은 한국관광공사 공공 API(KorService2)를 호출하는 함수들을 제공합니다.
 *
 * 주요 기능:
 * 1. 지역 코드 조회 (areaCode2)
 * 2. 지역 기반 관광지 목록 조회 (areaBasedList2)
 * 3. 키워드 검색 (searchKeyword2)
 * 4. 관광지 상세 정보 조회 (detailCommon2)
 * 5. 관광지 운영 정보 조회 (detailIntro2)
 * 6. 관광지 이미지 목록 조회 (detailImage2)
 *
 * 핵심 구현 로직:
 * - 환경변수에서 API 키 읽기 (NEXT_PUBLIC_TOUR_API_KEY 또는 TOUR_API_KEY)
 * - 공통 파라미터 자동 주입
 * - 에러 처리 및 타입 안전성 보장
 * - KATEC 좌표계를 WGS84로 변환하는 헬퍼 함수 제공
 *
 * @dependencies
 * - lib/types/tour.ts: 타입 정의
 *
 * @see {@link https://www.data.go.kr/data/15101578/openapi.do} - 한국관광공사 API 문서
 */

import type {
  TourItem,
  TourDetail,
  TourIntro,
  TourImage,
  AreaCode,
  TourApiResponse,
  Coordinates,
} from '@/lib/types/tour';

/**
 * API Base URL
 */
const BASE_URL = 'https://apis.data.go.kr/B551011/KorService2';

/**
 * 공통 파라미터
 */
const COMMON_PARAMS = {
  MobileOS: 'ETC',
  MobileApp: 'MyTrip',
  _type: 'json',
} as const;

/**
 * API 키 가져오기 (환경변수)
 */
function getApiKey(): string {
  const apiKey =
    process.env.NEXT_PUBLIC_TOUR_API_KEY || process.env.TOUR_API_KEY;

  if (!apiKey) {
    throw new Error(
      'TOUR_API_KEY 또는 NEXT_PUBLIC_TOUR_API_KEY 환경변수가 설정되지 않았습니다.',
    );
  }

  return apiKey;
}

/**
 * API 요청 헬퍼 함수
 */
async function fetchTourApi<T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
): Promise<TourApiResponse<T>> {
  const apiKey = getApiKey();

  const searchParams = new URLSearchParams({
    ...COMMON_PARAMS,
    serviceKey: apiKey,
    ...Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== '',
      ),
    ),
  });

  const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as TourApiResponse<T>;

    // API 응답 에러 확인
    if (data.response.header.resultCode !== '0000') {
      throw new Error(
        `API 에러: ${data.response.header.resultMsg} (코드: ${data.response.header.resultCode})`,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('알 수 없는 에러가 발생했습니다.');
  }
}

/**
 * KATEC 좌표계를 WGS84로 변환
 * KATEC 좌표는 정수형으로 저장되어 있으므로 10000000으로 나눔
 */
export function convertCoordinates(mapx: string, mapy: string): Coordinates {
  const lng = parseInt(mapx, 10) / 10000000;
  const lat = parseInt(mapy, 10) / 10000000;
  return { lng, lat };
}

/**
 * 지역 코드 조회 (areaCode2)
 * @param numOfRows 페이지당 항목 수 (기본값: 50)
 * @param pageNo 페이지 번호 (기본값: 1)
 */
export async function getAreaCodes(
  numOfRows: number = 50,
  pageNo: number = 1,
): Promise<AreaCode[]> {
  const response = await fetchTourApi<AreaCode>('/areaCode2', {
    numOfRows,
    pageNo,
  });

  const items = response.response.body.items;
  if (!items) {
    return [];
  }

  // 배열이 아닌 경우 배열로 변환
  const itemArray = Array.isArray(items.item) ? items.item : [items.item];
  return itemArray.filter((item) => item !== undefined);
}

/**
 * 지역 기반 관광지 목록 조회 (areaBasedList2)
 * @param areaCode 지역코드 (예: "1" = 서울)
 * @param contentTypeId 관광 타입 ID (예: "12" = 관광지)
 * @param numOfRows 페이지당 항목 수 (기본값: 10)
 * @param pageNo 페이지 번호 (기본값: 1)
 */
export async function getAreaBasedList(
  areaCode?: string,
  contentTypeId?: string,
  numOfRows: number = 10,
  pageNo: number = 1,
): Promise<{
  items: TourItem[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
}> {
  const response = await fetchTourApi<TourItem>('/areaBasedList2', {
    areaCode,
    contentTypeId,
    numOfRows,
    pageNo,
  });

  const items = response.response.body.items;
  const itemArray = items
    ? Array.isArray(items.item)
      ? items.item
      : [items.item]
    : [];

  return {
    items: itemArray.filter((item) => item !== undefined) as TourItem[],
    totalCount: response.response.body.totalCount || 0,
    pageNo: response.response.body.pageNo || 1,
    numOfRows: response.response.body.numOfRows || numOfRows,
  };
}

/**
 * 키워드 검색 (searchKeyword2)
 * @param keyword 검색 키워드
 * @param areaCode 지역코드 (선택)
 * @param contentTypeId 관광 타입 ID (선택)
 * @param numOfRows 페이지당 항목 수 (기본값: 10)
 * @param pageNo 페이지 번호 (기본값: 1)
 */
export async function searchKeyword(
  keyword: string,
  areaCode?: string,
  contentTypeId?: string,
  numOfRows: number = 10,
  pageNo: number = 1,
): Promise<{
  items: TourItem[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
}> {
  if (!keyword || keyword.trim() === '') {
    throw new Error('검색 키워드를 입력해주세요.');
  }

  const response = await fetchTourApi<TourItem>('/searchKeyword2', {
    keyword: keyword.trim(),
    areaCode,
    contentTypeId,
    numOfRows,
    pageNo,
  });

  const items = response.response.body.items;
  const itemArray = items
    ? Array.isArray(items.item)
      ? items.item
      : [items.item]
    : [];

  return {
    items: itemArray.filter((item) => item !== undefined) as TourItem[],
    totalCount: response.response.body.totalCount || 0,
    pageNo: response.response.body.pageNo || 1,
    numOfRows: response.response.body.numOfRows || numOfRows,
  };
}

/**
 * 관광지 상세 정보 조회 (detailCommon2)
 * @param contentId 콘텐츠 ID
 */
export async function getTourDetail(contentId: string): Promise<TourDetail | null> {
  if (!contentId || contentId.trim() === '') {
    throw new Error('콘텐츠 ID를 입력해주세요.');
  }

  const response = await fetchTourApi<TourDetail>('/detailCommon2', {
    contentId: contentId.trim(),
  });

  const items = response.response.body.items;
  if (!items) {
    return null;
  }

  const item = Array.isArray(items.item) ? items.item[0] : items.item;
  return (item as TourDetail) || null;
}

/**
 * 관광지 운영 정보 조회 (detailIntro2)
 * @param contentId 콘텐츠 ID
 * @param contentTypeId 관광 타입 ID (필수)
 */
export async function getTourIntro(
  contentId: string,
  contentTypeId: string,
): Promise<TourIntro | null> {
  if (!contentId || contentId.trim() === '') {
    throw new Error('콘텐츠 ID를 입력해주세요.');
  }

  if (!contentTypeId || contentTypeId.trim() === '') {
    throw new Error('콘텐츠 타입 ID를 입력해주세요.');
  }

  const response = await fetchTourApi<TourIntro>('/detailIntro2', {
    contentId: contentId.trim(),
    contentTypeId: contentTypeId.trim(),
  });

  const items = response.response.body.items;
  if (!items) {
    return null;
  }

  const item = Array.isArray(items.item) ? items.item[0] : items.item;
  return (item as TourIntro) || null;
}

/**
 * 관광지 이미지 목록 조회 (detailImage2)
 * @param contentId 콘텐츠 ID
 * @param numOfRows 페이지당 항목 수 (기본값: 20)
 * @param pageNo 페이지 번호 (기본값: 1)
 */
export async function getTourImages(
  contentId: string,
  numOfRows: number = 20,
  pageNo: number = 1,
): Promise<TourImage[]> {
  if (!contentId || contentId.trim() === '') {
    throw new Error('콘텐츠 ID를 입력해주세요.');
  }

  const response = await fetchTourApi<TourImage>('/detailImage2', {
    contentId: contentId.trim(),
    numOfRows,
    pageNo,
  });

  const items = response.response.body.items;
  if (!items) {
    return [];
  }

  const itemArray = Array.isArray(items.item) ? items.item : [items.item];
  return itemArray.filter((item) => item !== undefined) as TourImage[];
}

