/**
 * @file global-error.tsx
 * @description 글로벌 에러 경계 컴포넌트
 *
 * 이 파일은 루트 레이아웃에서 발생하는 에러를 처리하는 전역 에러 경계입니다.
 * error.tsx가 루트 레이아웃의 에러를 처리하지 못할 때 이 컴포넌트가 동작합니다.
 *
 * 주요 기능:
 * 1. 루트 레이아웃 에러 처리
 * 2. HTML 구조 재구성 (에러 발생 시)
 * 3. 최소한의 에러 UI 제공
 *
 * @dependencies
 * - components/ui/button: 버튼 컴포넌트
 * - lucide-react: 아이콘
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs} - Next.js 글로벌 에러 문서
 */

'use client';

import { useEffect } from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 글로벌 에러 경계 컴포넌트
 * 
 * 루트 레이아웃에서 발생하는 에러를 처리합니다.
 * 이 컴포넌트는 자체 HTML 구조를 포함해야 합니다.
 *
 * @param error - 발생한 에러 객체
 * @param reset - 에러 상태를 초기화하는 함수
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  // 개발 환경에서만 에러 정보를 콘솔에 출력
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('글로벌 에러 발생:', error);
      console.error('에러 메시지:', error.message);
      console.error('에러 스택:', error.stack);
      if (error.digest) {
        console.error('에러 디제스트:', error.digest);
      }
    }
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                심각한 오류가 발생했습니다
              </h1>
              <p className="text-gray-600 mb-6">
                애플리케이션에 문제가 발생했습니다. 페이지를 새로고침하거나 홈으로 돌아가주세요.
              </p>
              
              {/* 개발 환경에서만 에러 상세 정보 표시 */}
              {process.env.NODE_ENV === 'development' && (
                <div className="p-4 bg-gray-100 rounded-lg mb-6 text-left">
                  <p className="text-sm font-mono text-gray-800 break-all">
                    {error.message || '알 수 없는 오류'}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-gray-600 mt-2">
                      에러 ID: {error.digest}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={reset}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  다시 시도
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  홈으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

