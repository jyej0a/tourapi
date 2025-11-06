# 환경변수 검증 가이드

이 문서는 My Trip 프로젝트의 환경변수 검증 사용 방법을 안내합니다.

## 개요

환경변수 검증 시스템은 애플리케이션에서 사용하는 모든 환경변수를 중앙에서 관리하고 검증합니다.

**주요 기능:**
- 필수 환경변수 자동 검증
- 개발/프로덕션 환경별 검증 규칙
- 빌드 전 자동 검증
- 명확한 에러 메시지 제공

---

## 1. 환경변수 설정

### 1.1 .env.example 파일 생성

프로젝트 루트에 `.env.example` 파일을 생성하고 다음 내용을 복사해주세요:

```bash
# 한국관광공사 API
NEXT_PUBLIC_TOUR_API_KEY=your_tour_api_key_here

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

### 1.2 .env 파일 생성

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 실제 값을 입력해주세요:

```bash
cp .env.example .env
# .env 파일을 열어서 실제 값 입력
```

**⚠️ 주의**: `.env` 파일은 절대 Git에 커밋하지 마세요!

---

## 2. 환경변수 검증

### 2.1 수동 검증

환경변수를 수동으로 검증하려면 다음 명령어를 사용하세요:

```bash
# 기본 검증 (필수 환경변수만)
pnpm validate-env

# 엄격 모드 (선택 환경변수도 경고)
pnpm validate-env:strict
```

### 2.2 자동 검증

환경변수 검증은 다음 상황에서 자동으로 실행됩니다:

1. **개발 서버 시작 시**: `lib/env.ts`가 자동으로 검증
2. **빌드 전**: `prebuild` 스크립트가 자동 실행

```bash
# 빌드 시 자동 검증
pnpm build
```

### 2.3 검증 결과 예시

**성공 시:**
```
🔍 환경변수 검증 중...

✅ .env 파일 발견

✅ 환경변수 검증 완료
```

**실패 시:**
```
🔍 환경변수 검증 중...

❌ 환경변수 검증 실패:

❌ 필수 환경변수 누락: NEXT_PUBLIC_TOUR_API_KEY
   설명: 한국관광공사 API 키 (공개 가능)

💡 다음을 확인해주세요:
   1. .env 파일이 프로젝트 루트에 있는지 확인
   2. .env.example 파일을 참고하여 필수 환경변수 설정
   3. 환경변수 이름과 값이 올바른지 확인
```

---

## 3. 필수 환경변수 목록

### 3.1 한국관광공사 API

- `NEXT_PUBLIC_TOUR_API_KEY` ⭐ **필수**
  - 설명: 한국관광공사 API 키
  - 발급: https://www.data.go.kr/

### 3.2 Clerk Authentication

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` ⭐ **필수**
  - 설명: Clerk 공개 키
  
- `CLERK_SECRET_KEY` ⭐ **필수**
  - 설명: Clerk 비밀 키 (서버 전용, 절대 공개 금지)

### 3.3 Supabase

- `NEXT_PUBLIC_SUPABASE_URL` ⭐ **필수**
  - 설명: Supabase 프로젝트 URL
  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ⭐ **필수**
  - 설명: Supabase 공개 키
  
- `SUPABASE_SERVICE_ROLE_KEY` ⭐ **필수**
  - 설명: Supabase 서비스 역할 키 (서버 전용, 절대 공개 금지)

---

## 4. 선택 환경변수 목록

### 4.1 한국관광공사 API

- `TOUR_API_KEY` (선택)
  - 설명: 서버 전용 API 키 (NEXT_PUBLIC_TOUR_API_KEY가 없을 때 사용)

### 4.2 네이버 지도

- `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` (선택)
  - 설명: 네이버 지도 API 클라이언트 ID

### 4.3 Clerk

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` (선택, 기본값: `/sign-in`)
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` (선택, 기본값: `/`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` (선택, 기본값: `/`)

### 4.4 Supabase

- `NEXT_PUBLIC_STORAGE_BUCKET` (선택, 기본값: `uploads`)

### 4.5 배포 환경

- `NEXT_PUBLIC_VERCEL_URL` (선택, Vercel 자동 설정)
- `NEXT_PUBLIC_SITE_URL` (선택)

---

## 5. 보안 주의사항

### 5.1 공개 가능한 환경변수

다음 환경변수는 `NEXT_PUBLIC_` 접두사가 있어 클라이언트에 노출됩니다:

- `NEXT_PUBLIC_TOUR_API_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5.2 절대 공개 금지

다음 환경변수는 **절대 공개하지 마세요**:

- `CLERK_SECRET_KEY` ⚠️
- `SUPABASE_SERVICE_ROLE_KEY` ⚠️
- `TOUR_API_KEY` (서버 전용인 경우) ⚠️

### 5.3 보안 가이드

1. `.env` 파일은 `.gitignore`에 포함되어 있는지 확인
2. GitHub에 환경변수를 업로드하지 않기
3. 프로덕션 환경에서는 Vercel 환경변수 설정 사용
4. 비밀 키는 정기적으로 로테이션

---

## 6. 문제 해결

### 6.1 환경변수가 인식되지 않을 때

1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. 개발 서버를 재시작 (`pnpm dev`)
3. 환경변수 이름이 정확한지 확인 (대소문자 구분)
4. `pnpm validate-env`로 검증

### 6.2 빌드 시 환경변수 에러

프로덕션 빌드 시 필수 환경변수가 없으면 에러가 발생합니다:

```
❌ 프로덕션 환경변수 검증 실패
```

**해결 방법:**
1. Vercel Dashboard → Settings → Environment Variables
2. 필수 환경변수 모두 설정
3. 다시 배포

---

## 7. 코드에서 환경변수 사용

### 7.1 타입 안전한 접근

`lib/env.ts`의 `getEnv` 함수를 사용하세요:

```typescript
import { getEnv } from '@/lib/env';

// 환경변수 가져오기
const apiKey = getEnv('NEXT_PUBLIC_TOUR_API_KEY');
```

### 7.2 직접 접근 (비권장)

필요한 경우 `process.env`를 직접 사용할 수 있지만, 검증되지 않습니다:

```typescript
const apiKey = process.env.NEXT_PUBLIC_TOUR_API_KEY;
```

---

## 8. 참고 자료

- [Next.js 환경변수 문서](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel 환경변수 설정](https://vercel.com/docs/concepts/projects/environment-variables)
- [Clerk 환경변수 설정](https://clerk.com/docs/quickstarts/nextjs)
- [Supabase 환경변수 설정](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)

---

**마지막 업데이트**: 2025년 1월

