/**
 * @file loading.tsx
 * @description 로딩 스피너 컴포넌트
 *
 * 이 컴포넌트는 데이터를 불러오는 동안 표시되는 로딩 스피너를 제공합니다.
 *
 * 주요 기능:
 * - 지도 로딩 시 스피너 표시
 * - API 요청 중 로딩 상태 표시
 * - 다양한 크기 옵션 제공
 *
 * @dependencies
 * - lucide-react: Loader2 아이콘
 */

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 스피너 크기
   * - sm: 작은 크기 (16px)
   * - md: 기본 크기 (24px)
   * - lg: 큰 크기 (32px)
   * - xl: 매우 큰 크기 (48px)
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * 텍스트 표시 여부
   */
  text?: string;
  /**
   * 전체 화면 로딩 여부
   */
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
  xl: 'size-12',
} as const;

/**
 * 로딩 스피너 컴포넌트
 */
export function Loading({
  className,
  size = 'md',
  text,
  fullScreen = false,
}: LoadingProps) {
  const spinner = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        className,
      )}
    >
      <Loader2
        className={cn(
          'animate-spin text-primary',
          sizeMap[size],
        )}
        aria-label="로딩 중"
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * 인라인 로딩 스피너 (작은 크기)
 */
export function LoadingInline({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn('animate-spin text-primary size-4', className)}
      aria-label="로딩 중"
    />
  );
}

