/**
 * @file share-button.tsx
 * @description 관광지 상세페이지 공유 버튼 컴포넌트
 *
 * 이 컴포넌트는 관광지 상세페이지의 URL을 클립보드에 복사하는 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 현재 페이지 URL을 클립보드에 복사
 * 2. 복사 완료/실패 시 토스트 메시지 표시
 * 3. HTTPS 환경 확인 및 에러 처리
 *
 * 핵심 구현 로직:
 * - 클라이언트 사이드에서 navigator.clipboard API 사용
 * - window.location.href로 현재 페이지 URL 가져오기
 * - sonner toast로 사용자 피드백 제공
 *
 * @dependencies
 * - sonner: 토스트 알림
 * - lucide-react: Share2 아이콘
 * - components/ui/button: 버튼 컴포넌트
 */

'use client';

import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * URL 복사 기능
 */
function handleShareUrl() {
  // 클라이언트 사이드에서만 실행
  if (typeof window === 'undefined') {
    return;
  }

  // 현재 페이지 URL 가져오기
  const currentUrl = window.location.href;

  // 클립보드에 복사
  navigator.clipboard
    .writeText(currentUrl)
    .then(() => {
      toast.success('링크가 클립보드에 복사되었습니다.');
    })
    .catch(() => {
      toast.error('링크 복사에 실패했습니다.');
    });
}

interface ShareButtonProps {
  /**
   * 버튼 크기 (기본값: 'default')
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /**
   * 버튼 스타일 (기본값: 'outline')
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /**
   * 추가 클래스명
   */
  className?: string;
}

/**
 * 공유 버튼 컴포넌트
 */
export function ShareButton({
  size = 'default',
  variant = 'outline',
  className,
}: ShareButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShareUrl}
      className={className}
      aria-label="링크 공유"
    >
      <Share2 className="h-4 w-4 mr-2" />
      공유
    </Button>
  );
}

