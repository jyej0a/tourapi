/**
 * @file error.tsx
 * @description 에러 메시지 컴포넌트
 *
 * 이 컴포넌트는 에러 발생 시 사용자에게 친화적인 에러 메시지를 표시합니다.
 *
 * 주요 기능:
 * - API 에러: 에러 메시지 표시 + 재시도 버튼
 * - 네트워크 에러: 오프라인 안내
 * - 404 에러: 페이지를 찾을 수 없음
 * - 커스텀 에러 메시지 지원
 *
 * @dependencies
 * - lucide-react: AlertCircle, WifiOff, RefreshCw 아이콘
 * - components/ui/button: 재시도 버튼
 */

import { AlertCircle, WifiOff, RefreshCw, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorProps {
  /**
   * 에러 메시지
   */
  message?: string;
  /**
   * 에러 타입
   * - api: API 에러
   * - network: 네트워크 에러
   * - notFound: 404 에러
   * - custom: 커스텀 에러
   */
  type?: 'api' | 'network' | 'notFound' | 'custom';
  /**
   * 재시도 함수
   */
  onRetry?: () => void;
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 전체 화면 표시 여부
   */
  fullScreen?: boolean;
}

const errorConfig = {
  api: {
    icon: AlertCircle,
    defaultMessage: '데이터를 불러오는 중 오류가 발생했습니다.',
    title: '오류가 발생했습니다',
  },
  network: {
    icon: WifiOff,
    defaultMessage: '인터넷 연결을 확인해주세요.',
    title: '네트워크 오류',
  },
  notFound: {
    icon: FileQuestion,
    defaultMessage: '요청하신 페이지를 찾을 수 없습니다.',
    title: '페이지를 찾을 수 없음',
  },
  custom: {
    icon: AlertCircle,
    defaultMessage: '알 수 없는 오류가 발생했습니다.',
    title: '오류',
  },
} as const;

/**
 * 에러 메시지 컴포넌트
 */
export function Error({
  message,
  type = 'custom',
  onRetry,
  className,
  fullScreen = false,
}: ErrorProps) {
  const config = errorConfig[type];
  const Icon = config.icon;
  const displayMessage = message || config.defaultMessage;

  const errorContent = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-6 text-center',
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Icon
          className="size-12 text-destructive"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">{config.title}</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {displayMessage}
          </p>
        </div>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="size-4" />
          다시 시도
        </Button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        {errorContent}
      </div>
    );
  }

  return errorContent;
}

/**
 * 간단한 에러 메시지 (인라인)
 */
export function ErrorInline({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm text-destructive',
        className,
      )}
    >
      <AlertCircle className="size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

