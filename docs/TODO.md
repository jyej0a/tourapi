# My Trip 프로젝트 TODO

## Phase 1: 기본 구조 & 공통 설정

- [x] 프로젝트 셋업 (완료)
- [x] API 클라이언트 구현 (완료)
  - [x] `lib/api/tour-api.ts` (한국관광공사 API 호출 함수들) (완료)
  - [x] `app/api/tour/` (API Route들) (완료)
    - [x] `area-codes/route.ts` - 지역 코드 조회
    - [x] `list/route.ts` - 지역 기반 목록 조회
    - [x] `search/route.ts` - 키워드 검색
    - [x] `detail/[contentId]/route.ts` - 상세 정보 조회
    - [x] `intro/[contentId]/route.ts` - 운영 정보 조회
    - [x] `images/[contentId]/route.ts` - 이미지 목록 조회
- [x] 기본 타입 정의 (완료)
  - [x] `lib/types/tour.ts` (관광지 타입, 축제/행사 포함) (완료)
- [x] 레이아웃 구조 업데이트 (완료)
  - [x] `app/layout.tsx` (네비게이션, 메타태그 등)
- [x] 공통 컴포넌트 (완료)
  - [x] `components/ui/loading.tsx` (로딩 스피너) (완료)
  - [x] `components/ui/error.tsx` (에러 메시지) (완료)
  - [x] `components/ui/skeleton.tsx` (스켈레톤 UI) (완료)

## Phase 2: 홈페이지 (`/`) - 관광지 목록

### 2.1 페이지 기본 구조
- [x] `app/page.tsx` 생성 (완료)
- [x] 기본 UI 구조 확인 (헤더, 메인 영역, 푸터) (완료)

### 2.2 관광지 목록 기능 (MVP 2.1)
- [x] `components/tour-card.tsx` (관광지 카드 - 기본 정보만) (완료)
- [x] `components/tour-list.tsx` (목록 표시 - 하드코딩 데이터로 테스트) (완료)
- [x] API 연동하여 실제 데이터 표시 (완료)
- [x] 페이지 확인 및 스타일링 조정 (완료)

### 2.3 필터 기능 추가
- [x] `components/tour-filters.tsx` (지역/타입 필터 UI) (완료)
- [x] 필터 동작 연결 (상태 관리) (완료)
- [x] 필터링된 결과 표시 (완료)
- [x] 페이지 확인 및 UX 개선 (완료)

### 2.4 검색 기능 추가 (MVP 2.3)
- [x] `components/tour-search.tsx` (검색창 UI) (완료)
- [x] 검색 API 연동 (`searchKeyword2`) (완료)
- [x] 검색 결과 표시 (완료)
- [x] 검색 + 필터 조합 동작 (완료)
- [x] 페이지 확인 및 UX 개선 (완료)

### 2.5 지도 연동 (MVP 2.2) - ⏰ 내일 작업
- [ ] `components/naver-map.tsx` (기본 지도 표시)
- [ ] 관광지 마커 표시
- [ ] 마커 클릭 시 인포윈도우
- [ ] 리스트-지도 연동 (클릭/호버)
- [ ] 반응형 레이아웃 (데스크톱: 분할, 모바일: 탭)
- [ ] 페이지 확인 및 인터랙션 테스트

### 2.6 정렬 & 페이지네이션
- [x] 정렬 옵션 추가 (최신순, 이름순) (완료)
- [x] 페이지네이션 또는 무한 스크롤 (완료 - 페이지 번호 버튼 방식)
- [x] 로딩 상태 개선 (Skeleton UI) (완료 - 기존 구현 유지)
- [x] 최종 페이지 확인 (완료)

## Phase 3: 상세페이지 (`/places/[contentId]`)

### 3.1 페이지 기본 구조
- [x] `app/places/[contentId]/page.tsx` 생성 (완료)
- [x] 기본 레이아웃 구조 (뒤로가기 버튼, 섹션 구분) (완료)
- [x] 라우팅 테스트 (홈에서 클릭 시 이동) (완료)

### 3.2 기본 정보 섹션 (MVP 2.4.1)
- [x] `components/tour-detail/detail-info.tsx` (완료)
- [x] `detailCommon2` API 연동 (완료)
- [x] 관광지명, 이미지, 주소, 전화번호, 홈페이지, 개요 표시 (완료)
- [x] 주소 복사 기능 (완료)
- [x] 전화번호 클릭 시 전화 연결 (완료)
- [x] 페이지 확인 및 스타일링 (완료)

### 3.3 지도 섹션 (MVP 2.4.4) - ⏰ 내일 작업
- [ ] `components/tour-detail/detail-map.tsx`
- [ ] 해당 관광지 위치 표시 (마커 1개)
- [ ] "길찾기" 버튼 (네이버 지도 연동)
- [ ] 페이지 확인

### 3.4 공유 기능 (MVP 2.4.5)
- [x] `components/tour-detail/share-button.tsx` (완료)
- [x] URL 복사 기능 (클립보드 API) (완료)
- [x] 복사 완료 토스트 메시지 (완료)
- [x] Open Graph 메타태그 동적 생성 (완료)
- [x] 페이지 확인 및 공유 테스트 (완료)

### 3.5 추가 정보 섹션
- [x] `components/tour-detail/detail-intro.tsx` (운영 정보) (완료)
- [x] `detailIntro2` API 연동 (완료)
- [x] `components/tour-detail/detail-gallery.tsx` (이미지 갤러리) (완료)
- [x] `detailImage2` API 연동 (완료)
- [x] 페이지 확인 (완료)

## Phase 4: 북마크 페이지 (`/bookmarks`) - 선택 사항

### 4.1 Supabase 설정
- [x] `supabase/migrations/mytrip_schema.sql` 마이그레이션 파일 (완료)
- [x] `bookmarks` 테이블 생성 (완료)
- [x] RLS 정책 설정 (개발 환경: 비활성화 완료)

### 4.2 북마크 기능 구현
- [x] `components/bookmarks/bookmark-button.tsx` (완료)
- [x] 상세페이지에 북마크 버튼 추가 (완료)
- [x] Supabase DB 연동 (컴포넌트 내부에서 직접 구현) (완료)
- [x] 인증된 사용자 확인 (완료)
- [x] 로그인하지 않은 경우 localStorage 임시 저장 (완료)
- [ ] 상세페이지에서 북마크 동작 확인 (테스트 필요)

### 4.3 북마크 목록 페이지
- [x] `app/bookmarks/page.tsx` 생성 (완료)
- [x] `components/bookmarks/bookmark-list.tsx` (완료)
- [x] 북마크한 관광지 목록 표시 (완료)
- [x] 정렬 옵션 (최신순, 이름순, 지역별) (완료)
- [x] 일괄 삭제 기능 (완료)
- [ ] 페이지 확인 (테스트 필요)

## Phase 5: 최적화 & 배포

- [x] 이미지 최적화 (`next.config.ts` 외부 도메인 설정) (완료)
- [x] 전역 에러 핸들링 개선 (완료)
  - [x] `app/error.tsx` - 전역 에러 경계 (완료)
  - [x] `app/global-error.tsx` - 루트 레이아웃 에러 처리 (완료)
- [x] 404 페이지 (`app/not-found.tsx`) (완료)
- [ ] SEO 최적화
  - [ ] 메타태그 (동적 생성)
  - [ ] `app/sitemap.ts`
  - [ ] `app/robots.ts`
- [x] 성능 측정 (Lighthouse 점수 > 80) (완료)
  - [x] 성능 최적화 가이드 문서 작성 (`docs/PERFORMANCE.md`) (완료)
  - [x] Lighthouse 측정 방법 안내 (완료)
- [x] 환경변수 보안 검증 (완료)
  - [x] 환경변수 검증 유틸리티 (`lib/env.ts`) (완료)
  - [x] 환경변수 검증 스크립트 (`scripts/validate-env.ts`) (완료)
  - [x] package.json에 검증 스크립트 추가 (완료)
  - [x] .env.example 파일 생성 (완료)
  - [x] 빌드 전 자동 검증 설정 (prebuild) (완료)
- [ ] Vercel 배포 및 테스트

## 프로젝트 기본 구조 파일

- [x] `.cursor/` 디렉토리 (완료)
  - [x] `rules/` 커서룰 (완료)
  - [x] `mcp.json` MCP 서버 설정 (완료)
  - [ ] `dir.md` 프로젝트 디렉토리 구조
- [x] `.github/` 디렉토리 (완료)
- [ ] `.husky/` 디렉토리
- [ ] `app/` 디렉토리
  - [x] `favicon.ico` 파일 (완료)
  - [ ] `not-found.tsx` 파일
  - [ ] `robots.ts` 파일
  - [ ] `sitemap.ts` 파일
  - [ ] `manifest.ts` 파일
- [x] `supabase/` 디렉토리 (완료)
  - [x] `migrations/mytrip_schema.sql` (완료)
- [x] `public/` 디렉토리 (완료)
  - [x] `icons/` 디렉토리 (완료)
  - [x] `logo.png` 파일 (완료)
  - [x] `og-image.png` 파일 (완료)
- [x] `tsconfig.json` 파일 (완료)
- [x] `.cursorignore` 파일 (완료)
- [x] `.gitignore` 파일 (완료)
- [x] `.prettierignore` 파일 (완료)
- [x] `.prettierrc` 파일 (완료)
- [x] `eslint.config.mjs` 파일 (완료)
- [x] `AGENTS.md` 파일 (완료)
