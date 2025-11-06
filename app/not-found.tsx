/**
 * @file not-found.tsx
 * @description 404 페이지 컴포넌트
 *
 * 이 파일은 Next.js App Router의 404 페이지를 구현합니다.
 * 사용자가 존재하지 않는 페이지에 접근할 때 이 페이지가 표시됩니다.
 *
 * 주요 기능:
 * 1. 친화적인 404 에러 메시지
 * 2. 홈으로 돌아가기 버튼
 * 3. 검색 기능 안내
 * 4. 주요 페이지 링크 제공
 *
 * @dependencies
 * - next/navigation: 클라이언트 사이드 네비게이션
 * - components/ui/button: 버튼 컴포넌트
 * - lucide-react: 아이콘
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/not-found} - Next.js 404 페이지 문서
 */

import Link from 'next/link';
import { Home, Search, MapPin, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * 404 페이지 컴포넌트
 * 
 * 존재하지 않는 페이지에 접근할 때 표시됩니다.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="text-6xl font-bold text-primary">404</div>
          </div>
          <CardTitle className="text-3xl">페이지를 찾을 수 없습니다</CardTitle>
          <CardDescription className="mt-2 text-base">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 안내 메시지 */}
            <div className="text-center text-muted-foreground">
              <p className="mb-2">
                방문하시려는 페이지의 주소가 잘못되었거나,
              </p>
              <p>
                페이지가 삭제되었거나 이동되었을 수 있습니다.
              </p>
            </div>

            {/* 주요 페이지 링크 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                  <Home className="h-5 w-5" />
                  <span className="font-medium">홈으로 가기</span>
                  <span className="text-xs text-muted-foreground">관광지 목록 보기</span>
                </Button>
              </Link>
              
              <Link href="/?search=true">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                  <Search className="h-5 w-5" />
                  <span className="font-medium">검색하기</span>
                  <span className="text-xs text-muted-foreground">관광지 검색</span>
                </Button>
              </Link>
              
              <Link href="/bookmarks">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  <span className="font-medium">북마크</span>
                  <span className="text-xs text-muted-foreground">내 관광지</span>
                </Button>
              </Link>
              
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => window.history.back()}
              >
                <MapPin className="h-5 w-5" />
                <span className="font-medium">이전 페이지</span>
                <span className="text-xs text-muted-foreground">뒤로가기</span>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              홈으로 돌아가기
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

