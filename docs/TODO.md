# My Trip 프로젝트 TODO

## Phase 1: 기본 구조 & 공통 설정

- [x] 프로젝트 셋업 (완료)
- [x] API 클라이언트 구현 (완료)
  - [x] `lib/api/tour-api.ts` (한국관광공사 API 호출 함수들) (완료)
  - [ ] `app/api/tour/route.ts` (API Route, 선택 사항)
- [x] 기본 타입 정의 (완료)
  - [x] `lib/types/tour.ts` (관광지 타입) (완료)
  - [ ] `lib/types/festival.ts` (축제/행사 타입) - tour.ts에 통합됨
- [x] 레이아웃 구조 업데이트 (완료)
  - [x] `app/layout.tsx` (네비게이션, 메타태그 등)
- [ ] 공통 컴포넌트
  - [ ] `components/ui/loading.tsx` (로딩 스피너)
  - [ ] `components/ui/error.tsx` (에러 메시지)
  - [ ] `components/ui/skeleton.tsx` (스켈레톤 UI)

## Phase 2: 홈페이지 (`/`) - 관광지 목록

### 2.1 페이지 기본 구조
- [x] `app/page.tsx` 생성 (완료)
- [x] 기본 UI 구조 확인 (헤더, 메인 영역, 푸터) (완료)

### 2.2 관광지 목록 기능 (MVP 2.1)
- [ ] `components/tour-card.tsx` (관광지 카드 - 기본 정보만)
- [ ] `components/tour-list.tsx` (목록 표시 - 하드코딩 데이터로 테스트)
- [ ] API 연동하여 실제 데이터 표시
- [ ] 페이지 확인 및 스타일링 조정

### 2.3 필터 기능 추가
- [ ] `components/tour-filters.tsx` (지역/타입 필터 UI)
- [ ] 필터 동작 연결 (상태 관리)
- [ ] 필터링된 결과 표시
- [ ] 페이지 확인 및 UX 개선

### 2.4 검색 기능 추가 (MVP 2.3)
- [ ] `components/tour-search.tsx` (검색창 UI)
- [ ] 검색 API 연동 (`searchKeyword2`)
- [ ] 검색 결과 표시
- [ ] 검색 + 필터 조합 동작
- [ ] 페이지 확인 및 UX 개선

### 2.5 지도 연동 (MVP 2.2) - ⏰ 내일 작업
- [ ] `components/naver-map.tsx` (기본 지도 표시)
- [ ] 관광지 마커 표시
- [ ] 마커 클릭 시 인포윈도우
- [ ] 리스트-지도 연동 (클릭/호버)
- [ ] 반응형 레이아웃 (데스크톱: 분할, 모바일: 탭)
- [ ] 페이지 확인 및 인터랙션 테스트

### 2.6 정렬 & 페이지네이션
- [ ] 정렬 옵션 추가 (최신순, 이름순)
- [ ] 페이지네이션 또는 무한 스크롤
- [ ] 로딩 상태 개선 (Skeleton UI)
- [ ] 최종 페이지 확인

## Phase 3: 상세페이지 (`/places/[contentId]`)

### 3.1 페이지 기본 구조
- [ ] `app/places/[contentId]/page.tsx` 생성
- [ ] 기본 레이아웃 구조 (뒤로가기 버튼, 섹션 구분)
- [ ] 라우팅 테스트 (홈에서 클릭 시 이동)

### 3.2 기본 정보 섹션 (MVP 2.4.1)
- [ ] `components/tour-detail/detail-info.tsx`
- [ ] `detailCommon2` API 연동
- [ ] 관광지명, 이미지, 주소, 전화번호, 홈페이지, 개요 표시
- [ ] 주소 복사 기능
- [ ] 전화번호 클릭 시 전화 연결
- [ ] 페이지 확인 및 스타일링

### 3.3 지도 섹션 (MVP 2.4.4) - ⏰ 내일 작업
- [ ] `components/tour-detail/detail-map.tsx`
- [ ] 해당 관광지 위치 표시 (마커 1개)
- [ ] "길찾기" 버튼 (네이버 지도 연동)
- [ ] 페이지 확인

### 3.4 공유 기능 (MVP 2.4.5)
- [ ] `components/tour-detail/share-button.tsx`
- [ ] URL 복사 기능 (클립보드 API)
- [ ] 복사 완료 토스트 메시지
- [ ] Open Graph 메타태그 동적 생성
- [ ] 페이지 확인 및 공유 테스트

### 3.5 추가 정보 섹션 (향후 구현)
- [ ] `components/tour-detail/detail-intro.tsx` (운영 정보)
- [ ] `detailIntro2` API 연동
- [ ] `components/tour-detail/detail-gallery.tsx` (이미지 갤러리)
- [ ] `detailImage2` API 연동
- [ ] 페이지 확인

## Phase 4: 북마크 페이지 (`/bookmarks`) - 선택 사항

### 4.1 Supabase 설정
- [x] `supabase/migrations/mytrip_schema.sql` 마이그레이션 파일 (완료)
- [x] `bookmarks` 테이블 생성 (완료)
- [x] RLS 정책 설정 (개발 환경: 비활성화 완료)

### 4.2 북마크 기능 구현
- [ ] `components/bookmarks/bookmark-button.tsx`
- [ ] 상세페이지에 북마크 버튼 추가
- [ ] Supabase DB 연동 (`lib/api/supabase-api.ts`)
- [ ] 인증된 사용자 확인
- [ ] 로그인하지 않은 경우 localStorage 임시 저장
- [ ] 상세페이지에서 북마크 동작 확인

### 4.3 북마크 목록 페이지
- [ ] `app/bookmarks/page.tsx` 생성
- [ ] `components/bookmarks/bookmark-list.tsx`
- [ ] 북마크한 관광지 목록 표시
- [ ] 정렬 옵션 (최신순, 이름순, 지역별)
- [ ] 일괄 삭제 기능
- [ ] 페이지 확인

## Phase 5: 최적화 & 배포

- [ ] 이미지 최적화 (`next.config.ts` 외부 도메인 설정)
- [ ] 전역 에러 핸들링 개선
- [ ] 404 페이지 (`app/not-found.tsx`)
- [ ] SEO 최적화
  - [ ] 메타태그 (동적 생성)
  - [ ] `app/sitemap.ts`
  - [ ] `app/robots.ts`
- [ ] 성능 측정 (Lighthouse 점수 > 80)
- [ ] 환경변수 보안 검증
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
