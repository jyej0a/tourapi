'use client';

import { useRouter } from 'next/navigation';
import { Button, type ButtonProps } from '@/components/ui/button';

/**
 * 뒤로가기 버튼 컴포넌트
 * 
 * 클라이언트 사이드에서만 동작하는 뒤로가기 버튼입니다.
 */
export function BackButton({ children, ...props }: ButtonProps) {
  const router = useRouter();
  
  return (
    <Button
      {...props}
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
}

