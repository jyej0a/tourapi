#!/usr/bin/env node
/**
 * @file validate-env.ts
 * @description 환경변수 검증 스크립트
 *
 * 이 스크립트는 애플리케이션의 모든 환경변수를 검증합니다.
 * 
 * 사용 방법:
 *   pnpm validate-env          # 기본 검증
 *   pnpm validate-env --strict  # 엄격 모드 (선택 환경변수도 경고)
 *   pnpm validate-env --check   # 검증만 하고 종료 코드 반환
 */

import { validateEnv } from '../lib/env';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * .env 파일을 읽어서 process.env에 로드
 * 
 * tsx로 직접 실행할 때는 .env 파일이 자동으로 로드되지 않으므로
 * 수동으로 로드해야 합니다.
 */
function loadEnvFile(): void {
  const envPath = join(process.cwd(), '.env');
  
  if (!existsSync(envPath)) {
    return;
  }

  const envContent = readFileSync(envPath, 'utf-8');
  
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        const envKey = key.trim();
        const envValue = valueParts.join('=').trim();
        // 이미 process.env에 있으면 덮어쓰지 않음 (시스템 환경변수 우선)
        if (!process.env[envKey]) {
          process.env[envKey] = envValue;
        }
      }
    }
  });
}

/**
 * .env 파일 읽기 (참고용)
 */
function readEnvFile(): Record<string, string> {
  const envPath = join(process.cwd(), '.env');
  
  if (!existsSync(envPath)) {
    return {};
  }

  const envContent = readFileSync(envPath, 'utf-8');
  const envVars: Record<string, string> = {};

  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  return envVars;
}

/**
 * 메인 함수
 */
function main() {
  // .env 파일을 process.env에 로드 (검증 전에 먼저 로드)
  loadEnvFile();
  
  const args = process.argv.slice(2);
  const strict = args.includes('--strict') || args.includes('-s');
  const checkOnly = args.includes('--check') || args.includes('-c');

  console.log('🔍 환경변수 검증 중...\n');

  // .env 파일 확인
  const envPath = join(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    console.warn('⚠️  .env 파일이 없습니다.\n');
    console.warn('💡 .env.example 파일을 참고하여 .env 파일을 생성해주세요.\n');
  } else {
    console.log('✅ .env 파일 발견\n');
  }

  // 환경변수 검증
  const result = validateEnv(strict);

  // 결과 출력
  if (result.errors.length > 0) {
    console.error('❌ 환경변수 검증 실패:\n');
    result.errors.forEach((error) => {
      console.error(error);
      console.error('');
    });
    
    if (!checkOnly) {
      console.error('💡 다음을 확인해주세요:\n');
      console.error('   1. .env 파일이 프로젝트 루트에 있는지 확인');
      console.error('   2. .env.example 파일을 참고하여 필수 환경변수 설정');
      console.error('   3. 환경변수 이름과 값이 올바른지 확인\n');
    }
    
    process.exit(1);
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️  환경변수 경고:\n');
    result.warnings.forEach((warning) => {
      console.warn(warning);
      console.warn('');
    });
  }

  if (result.isValid) {
    console.log('✅ 환경변수 검증 완료\n');
    
    if (!checkOnly) {
      console.log('📋 설정된 환경변수 목록:\n');
      const envVars = readEnvFile();
      const envKeys = Object.keys(envVars);
      
      if (envKeys.length > 0) {
        envKeys.forEach((key) => {
          const value = envVars[key];
          // 보안을 위해 비밀 키는 일부만 표시
          if (key.includes('SECRET') || key.includes('SERVICE_ROLE') || key.includes('KEY')) {
            const masked = value.length > 8 
              ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
              : '***';
            console.log(`   ${key}=${masked}`);
          } else {
            console.log(`   ${key}=${value}`);
          }
        });
        console.log('');
      }
    }
    
    process.exit(0);
  }
}

// 스크립트 실행
main();

