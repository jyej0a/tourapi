/**
 * @file error.tsx
 * @description 전역 에러 경계 컴포넌트
 *
 * 이 파일은 Next.js App Router의 에러 경계(Error Boundary)를 구현합니다.
 * 앱의 어느 부분에서든 예상치 못한 에러가 발생하면 이 컴포넌트가 표시됩니다.
 *
 * 주요 기능:
 * 1. 런타임 에러 캐치 및 표시
 * 2. 에러 정보 로깅 (개발 환경)
 * 3. 재시도 기능 제공
 * 4. 홈으로 돌아가기 버튼
 *
 * @dependencies
 * - next/navigation: 클라이언트 사이드 네비게이션
 * - components/ui/button: 버튼 컴포넌트
 * - lucide-react: 아이콘
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/error} - Next.js 에러 처리 문서
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 전역 에러 경계 컴포넌트
 * 
 * @param error - 발생한 에러 객체
 * @param reset - 에러 상태를 초기화하는 함수
 */
export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  // 개발 환경에서만 에러 정보를 콘솔에 출력
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('에러 발생:', error);
      console.error('에러 메시지:', error.message);
      console.error('에러 스택:', error.stack);
      if (error.digest) {
        console.error('에러 디제스트:', error.digest);
      }
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">문제가 발생했습니다</CardTitle>
          <CardDescription className="mt-2">
            예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 개발 환경에서만 에러 상세 정보 표시 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-mono text-muted-foreground break-all">
                  {error.message || '알 수 없는 오류'}
                </p>
                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-2">
                    에러 ID: {error.digest}
                  </p>
                )}
              </div>
            )}
            
            {/* 일반 사용자를 위한 안내 메시지 */}
            <div className="text-sm text-muted-foreground space-y-2">
              <p>문제가 계속되면 다음을 시도해보세요:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>페이지를 새로고침하세요</li>
                <li>잠시 후 다시 접속해보세요</li>
                <li>브라우저 캐시를 삭제해보세요</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={reset}
            className="w-full gap-2"
            size="lg"
          >
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full gap-2"
            size="lg"
          >
            <Home className="h-4 w-4" />
            홈으로 돌아가기
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

