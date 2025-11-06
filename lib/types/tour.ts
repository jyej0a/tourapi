/**
 * @file tour.ts
 * @description 한국관광공사 API 타입 정의
 *
 * 이 파일은 한국관광공사 공공 API(KorService2)의 응답 데이터 타입을 정의합니다.
 *
 * 주요 타입:
 * - TourItem: 관광지 목록 항목
 * - TourDetail: 관광지 상세 정보
 * - TourIntro: 관광지 운영 정보
 * - TourImage: 관광지 이미지
 * - AreaCode: 지역 코드
 *
 * @see {@link https://www.data.go.kr/data/15101578/openapi.do} - 한국관광공사 API 문서
 */

/**
 * 관광 타입 ID (Content Type ID)
 */
export const CONTENT_TYPE = {
  TOURIST_SPOT: '12', // 관광지
  CULTURAL_FACILITY: '14', // 문화시설
  FESTIVAL: '15', // 축제/행사
  TRAVEL_COURSE: '25', // 여행코스
  LEISURE_SPORTS: '28', // 레포츠
  ACCOMMODATION: '32', // 숙박
  SHOPPING: '38', // 쇼핑
  RESTAURANT: '39', // 음식점
} as const;

export type ContentTypeId = (typeof CONTENT_TYPE)[keyof typeof CONTENT_TYPE];

/**
 * 관광지 목록 항목 (areaBasedList2 응답)
 */
export interface TourItem {
  addr1: string; // 주소
  addr2?: string; // 상세주소
  areacode: string; // 지역코드
  contentid: string; // 콘텐츠ID
  contenttypeid: string; // 콘텐츠타입ID
  title: string; // 제목
  mapx: string; // 경도 (KATEC 좌표계, 정수형)
  mapy: string; // 위도 (KATEC 좌표계, 정수형)
  firstimage?: string; // 대표이미지1
  firstimage2?: string; // 대표이미지2
  tel?: string; // 전화번호
  cat1?: string; // 대분류
  cat2?: string; // 중분류
  cat3?: string; // 소분류
  modifiedtime: string; // 수정일
}

/**
 * 관광지 상세 정보 (detailCommon2 응답)
 */
export interface TourDetail {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1: string;
  addr2?: string;
  zipcode?: string;
  tel?: string;
  homepage?: string;
  overview?: string; // 개요 (긴 설명)
  firstimage?: string;
  firstimage2?: string;
  mapx: string; // 경도 (KATEC 좌표계, 정수형)
  mapy: string; // 위도 (KATEC 좌표계, 정수형)
}

/**
 * 관광지 운영 정보 (detailIntro2 응답)
 * 타입별로 필드가 다르므로 선택적 필드로 정의
 */
export interface TourIntro {
  contentid: string;
  contenttypeid: string;
  usetime?: string; // 이용시간
  restdate?: string; // 휴무일
  infocenter?: string; // 문의처
  parking?: string; // 주차 가능
  chkpet?: string; // 반려동물 동반
  // 기타 타입별 필드들...
  [key: string]: string | undefined;
}

/**
 * 관광지 이미지 (detailImage2 응답)
 */
export interface TourImage {
  contentid: string;
  imagetype?: string; // 이미지 타입
  originimgurl?: string; // 원본 이미지 URL
  serialnum?: string; // 순번
  smallimageurl?: string; // 썸네일 이미지 URL
}

/**
 * 지역 코드 (areaCode2 응답)
 */
export interface AreaCode {
  code: string; // 지역코드
  name: string; // 지역명
  rnum?: string; // 순번
}

/**
 * API 응답 공통 구조
 */
export interface TourApiResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item: T | T[];
      };
      numOfRows?: number;
      pageNo?: number;
      totalCount?: number;
    };
  };
}

/**
 * 좌표 변환 헬퍼 타입
 * KATEC 좌표계를 WGS84로 변환
 */
export interface Coordinates {
  lng: number; // 경도 (WGS84)
  lat: number; // 위도 (WGS84)
}

