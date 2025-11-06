# My Trip 프로젝트 디렉토리 구조

이 문서는 My Trip 프로젝트의 전체 디렉토리 구조를 설명합니다.

## 전체 구조

```
datadata/
├── .cursor/                    # Cursor AI 설정 디렉토리
│   ├── mcp.json               # MCP 서버 설정
│   └── rules/                  # Cursor 규칙 파일들
│       ├── common/            # 공통 규칙
│       ├── supabase/          # Supabase 관련 규칙
│       └── web/               # 웹 개발 관련 규칙
│
├── .github/                    # GitHub 설정 (워크플로우, 이슈 템플릿 등)
│
├── app/                        # Next.js App Router 디렉토리
│   ├── api/                   # API Routes
│   │   ├── sync-user/        # 사용자 동기화 API
│   │   └── tour/             # 관광지 API
│   │       ├── area-codes/   # 지역 코드 조회
│   │       ├── detail/       # 상세 정보 조회
│   │       ├── images/       # 이미지 목록 조회
│   │       ├── intro/        # 운영 정보 조회
│   │       ├── list/         # 목록 조회
│   │       └── search/       # 검색
│   ├── auth-test/            # 인증 테스트 페이지
│   ├── bookmarks/            # 북마크 페이지
│   ├── places/               # 관광지 상세 페이지
│   │   └── [contentId]/     # 동적 라우트
│   ├── storage-test/         # Storage 테스트 페이지
│   ├── error.tsx             # 전역 에러 경계
│   ├── favicon.ico           # 파비콘
│   ├── global-error.tsx      # 글로벌 에러 경계
│   ├── globals.css           # 전역 스타일
│   ├── layout.tsx            # 루트 레이아웃
│   ├── manifest.ts           # PWA 매니페스트
│   ├── not-found.tsx         # 404 페이지
│   ├── page.tsx              # 홈페이지
│   ├── robots.ts             # robots.txt
│   └── sitemap.ts            # sitemap.xml
│
├── components/                # React 컴포넌트
│   ├── bookmarks/           # 북마크 관련 컴포넌트
│   │   ├── bookmark-button.tsx
│   │   └── bookmark-list.tsx
│   ├── providers/            # React Context 프로바이더
│   │   └── sync-user-provider.tsx
│   ├── tour-detail/          # 관광지 상세 컴포넌트
│   │   ├── detail-gallery.tsx
│   │   ├── detail-info.tsx
│   │   ├── detail-intro.tsx
│   │   └── share-button.tsx
│   ├── ui/                   # shadcn/ui 컴포넌트
│   │   ├── accordion.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── error.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── loading.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   └── textarea.tsx
│   ├── Navbar.tsx            # 네비게이션 바
│   ├── tour-card.tsx         # 관광지 카드
│   ├── tour-filters.tsx      # 필터 컴포넌트
│   ├── tour-list.tsx         # 관광지 목록
│   ├── tour-pagination.tsx   # 페이지네이션
│   ├── tour-search.tsx       # 검색 컴포넌트
│   └── tour-sort.tsx         # 정렬 컴포넌트
│
├── docs/                      # 문서 디렉토리
│   ├── DIR.md                # 디렉토리 구조 (구버전)
│   ├── ENV_VALIDATION.md     # 환경변수 검증 가이드
│   ├── PERFORMANCE.md        # 성능 최적화 가이드
│   ├── PRD.md                # 제품 요구사항 문서
│   ├── TODO.md               # TODO 목록
│   └── reference/            # 참고 자료
│       └── design.md         # 디자인 가이드
│
├── hooks/                     # 커스텀 React Hooks
│   └── use-sync-user.ts      # 사용자 동기화 훅
│
├── lib/                      # 유틸리티 및 라이브러리
│   ├── api/                  # API 클라이언트
│   │   └── tour-api.ts       # 한국관광공사 API
│   ├── supabase/             # Supabase 클라이언트
│   │   ├── clerk-client.ts   # Clerk 연동 클라이언트
│   │   ├── client.ts         # 공개 클라이언트
│   │   ├── server.ts         # 서버 클라이언트
│   │   └── service-role.ts   # 서비스 역할 클라이언트
│   ├── types/                # TypeScript 타입 정의
│   │   └── tour.ts           # 관광지 타입
│   ├── env.ts                # 환경변수 검증
│   ├── supabase.ts           # 레거시 Supabase 클라이언트
│   └── utils.ts              # 공통 유틸리티
│
├── public/                   # 정적 파일
│   ├── icons/                # PWA 아이콘
│   │   ├── icon-192x192.png
│   │   ├── icon-256x256.png
│   │   ├── icon-384x384.png
│   │   └── icon-512x512.png
│   ├── logo.png              # 로고
│   └── og-image.png          # Open Graph 이미지
│
├── scripts/                   # 스크립트 파일
│   └── validate-env.ts      # 환경변수 검증 스크립트
│
├── supabase/                 # Supabase 설정
│   ├── config.toml           # Supabase 설정 파일
│   └── migrations/           # 데이터베이스 마이그레이션
│       ├── mytrip_schema.sql
│       ├── setup_schema.sql
│       └── setup_storage.sql
│
├── AGENTS.md                 # AI 에이전트 가이드
├── CLAUDE.md                 # 프로젝트 설정 문서
├── components.json            # shadcn/ui 설정
├── eslint.config.mjs         # ESLint 설정
├── middleware.ts             # Next.js 미들웨어
├── next.config.ts             # Next.js 설정
├── package.json               # 프로젝트 의존성
├── postcss.config.mjs         # PostCSS 설정
├── tsconfig.json              # TypeScript 설정
└── ...기타 설정 파일들
```

## 주요 디렉토리 설명

### `app/`
Next.js App Router의 라우팅 디렉토리입니다.
- `page.tsx`: 각 경로의 페이지 컴포넌트
- `layout.tsx`: 레이아웃 컴포넌트
- `route.ts`: API Route
- `error.tsx`, `not-found.tsx`: 특수 파일

### `components/`
재사용 가능한 React 컴포넌트입니다.
- `ui/`: shadcn/ui 컴포넌트 (자동 생성, 수정 금지)
- 기능별 컴포넌트는 적절한 하위 디렉토리에 구성

### `lib/`
유틸리티 함수와 클라이언트 설정입니다.
- `api/`: 외부 API 호출 함수
- `supabase/`: Supabase 클라이언트 (환경별로 분리)
- `types/`: TypeScript 타입 정의
- `utils.ts`: 공통 유틸리티 함수

### `hooks/`
커스텀 React Hooks입니다.

### `docs/`
프로젝트 문서입니다.
- `PRD.md`: 제품 요구사항
- `TODO.md`: 작업 목록
- `PERFORMANCE.md`: 성능 최적화 가이드
- `ENV_VALIDATION.md`: 환경변수 검증 가이드

### `supabase/`
Supabase 데이터베이스 설정 및 마이그레이션입니다.

## 파일 네이밍 규칙

- **컴포넌트**: PascalCase (예: `TourCard.tsx`)
- **파일명**: kebab-case (예: `tour-card.tsx`)
- **함수/변수**: camelCase
- **타입/인터페이스**: PascalCase
- **상수**: UPPER_SNAKE_CASE

## 중요한 파일

- `AGENTS.md`: AI 에이전트 가이드
- `CLAUDE.md`: 프로젝트 설정 및 규칙
- `next.config.ts`: Next.js 설정 (이미지 최적화 등)
- `middleware.ts`: Clerk 인증 미들웨어
- `.env.example`: 환경변수 예시 파일

## 참고

프로젝트 구조 변경 시 이 문서도 함께 업데이트해주세요.

