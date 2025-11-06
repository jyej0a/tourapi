/**
 * @file env.ts
 * @description 환경변수 검증 및 타입 안전한 접근 유틸리티
 *
 * 이 파일은 애플리케이션에서 사용하는 모든 환경변수를 중앙에서 관리하고 검증합니다.
 *
 * 주요 기능:
 * 1. 환경변수 존재 여부 검증
 * 2. 환경변수 타입 안전한 접근
 * 3. 개발/프로덕션 환경별 검증 규칙
 * 4. 환경변수 누락 시 명확한 에러 메시지 제공
 *
 * @dependencies
 * - 환경변수는 .env 파일 또는 시스템 환경변수에서 로드됨
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/configuring/environment-variables} - Next.js 환경변수 문서
 */

/**
 * 환경변수 스키마 정의
 * 
 * 각 환경변수의 타입과 필수 여부를 정의합니다.
 */
const envSchema = {
  // 한국관광공사 API
  NEXT_PUBLIC_TOUR_API_KEY: {
    required: true,
    description: '한국관광공사 API 키 (공개 가능)',
    fallback: 'TOUR_API_KEY',
  },
  TOUR_API_KEY: {
    required: false,
    description: '한국관광공사 API 키 (서버 전용, NEXT_PUBLIC_TOUR_API_KEY가 없을 때 사용)',
    fallback: 'NEXT_PUBLIC_TOUR_API_KEY',
  },
  
  // 네이버 지도
  NEXT_PUBLIC_NAVER_MAP_CLIENT_ID: {
    required: false,
    description: '네이버 지도 API 클라이언트 ID',
  },
  
  // Clerk Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: {
    required: true,
    description: 'Clerk 공개 키',
  },
  CLERK_SECRET_KEY: {
    required: true,
    description: 'Clerk 비밀 키 (서버 전용)',
  },
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: {
    required: false,
    description: 'Clerk 로그인 URL',
    default: '/sign-in',
  },
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: {
    required: false,
    description: 'Clerk 로그인 후 리다이렉트 URL',
    default: '/',
  },
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: {
    required: false,
    description: 'Clerk 회원가입 후 리다이렉트 URL',
    default: '/',
  },
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: {
    required: true,
    description: 'Supabase 프로젝트 URL',
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    required: true,
    description: 'Supabase 공개 키',
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    required: true,
    description: 'Supabase 서비스 역할 키 (서버 전용, 절대 공개 금지)',
  },
  NEXT_PUBLIC_STORAGE_BUCKET: {
    required: false,
    description: 'Supabase Storage 버킷 이름',
    default: 'uploads',
  },
  
  // 배포 환경 (선택)
  NEXT_PUBLIC_VERCEL_URL: {
    required: false,
    description: 'Vercel 배포 URL',
  },
  NEXT_PUBLIC_SITE_URL: {
    required: false,
    description: '사이트 기본 URL',
  },
} as const;

/**
 * 환경변수 검증 결과
 */
interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 환경변수 검증 함수
 * 
 * @param strict - 엄격 모드 (필수가 아닌 것도 경고)
 * @returns 검증 결과
 */
export function validateEnv(strict: boolean = false): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 각 환경변수 검증
  for (const [key, config] of Object.entries(envSchema)) {
    const value = process.env[key];
    const fallbackValue = config.fallback
      ? process.env[config.fallback]
      : undefined;

    // 필수 환경변수 검증
    if (config.required && !value && !fallbackValue) {
      errors.push(
        `❌ 필수 환경변수 누락: ${key}\n   설명: ${config.description}`,
      );
    }

    // 엄격 모드: 필수가 아닌 것도 경고
    if (strict && !config.required && !value && !config.default) {
      warnings.push(
        `⚠️  선택 환경변수 누락: ${key}\n   설명: ${config.description}`,
      );
    }

    // 보안 관련 경고
    if (key.includes('SECRET') || key.includes('SERVICE_ROLE')) {
      if (key.includes('NEXT_PUBLIC_')) {
        warnings.push(
          `⚠️  보안 경고: ${key}는 NEXT_PUBLIC_ 접두사가 있어 클라이언트에 노출됩니다.`,
        );
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 환경변수 타입 안전한 접근 함수
 * 
 * @param key - 환경변수 키
 * @param defaultValue - 기본값 (선택)
 * @returns 환경변수 값
 */
export function getEnv(key: keyof typeof envSchema, defaultValue?: string): string {
  const config = envSchema[key];
  const value =
    process.env[key] ||
    (config.fallback ? process.env[config.fallback] : undefined) ||
    config.default ||
    defaultValue;

  if (config.required && !value) {
    throw new Error(
      `환경변수 ${key}가 설정되지 않았습니다. ${config.description}`,
    );
  }

  return value || '';
}

/**
 * 개발 환경에서 환경변수 검증 및 출력
 * 
 * 개발 서버 시작 시 자동으로 호출됩니다.
 */
export function validateEnvOnStartup(): void {
  if (process.env.NODE_ENV === 'development') {
    const result = validateEnv(false);
    
    if (result.errors.length > 0) {
      console.error('\n❌ 환경변수 검증 실패:\n');
      result.errors.forEach((error) => console.error(error));
      console.error(
        '\n💡 .env 파일을 확인하고 필수 환경변수를 설정해주세요.\n',
      );
      // 개발 환경에서는 에러를 발생시키지 않고 경고만 표시
    }

    if (result.warnings.length > 0) {
      console.warn('\n⚠️  환경변수 경고:\n');
      result.warnings.forEach((warning) => console.warn(warning));
      console.warn('');
    }

    if (result.isValid && result.warnings.length === 0) {
      console.log('✅ 환경변수 검증 완료\n');
    }
  }
}

/**
 * 프로덕션 환경에서 환경변수 검증
 * 
 * 빌드 시 필수 환경변수가 없으면 에러를 발생시킵니다.
 */
export function validateEnvForProduction(): void {
  if (process.env.NODE_ENV === 'production') {
    const result = validateEnv(true);
    
    if (!result.isValid) {
      console.error('\n❌ 프로덕션 환경변수 검증 실패:\n');
      result.errors.forEach((error) => console.error(error));
      throw new Error(
        '프로덕션 환경변수 검증에 실패했습니다. 필수 환경변수를 설정해주세요.',
      );
    }
  }
}

// 개발 환경에서 자동 검증 (모듈 로드 시)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  validateEnvOnStartup();
}

