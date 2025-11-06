/**
 * @file page.tsx
 * @description 북마크 목록 페이지
 *
 * 이 페이지는 사용자가 북마크한 관광지 목록을 표시합니다.
 *
 * 주요 기능:
 * 1. 북마크한 관광지 목록 표시
 * 2. 정렬 옵션 (최신순, 이름순, 지역별)
 * 3. 일괄 삭제 기능
 * 4. 빈 상태 UI (북마크가 없을 때)
 *
 * 핵심 구현 로직:
 * - Server Component에서 인증 확인
 * - Client Component로 북마크 목록 표시 및 상호작용 처리
 * - 북마크 데이터와 관광지 정보 조합
 *
 * @dependencies
 * - components/bookmarks/bookmark-list.tsx: 북마크 목록 컴포넌트
 * - @clerk/nextjs: 인증 확인
 */

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { BookmarkList } from '@/components/bookmarks/bookmark-list';

/**
 * 북마크 목록 페이지
 */
export default async function BookmarksPage() {
  // 인증 확인
  const { userId } = await auth();

  if (!userId) {
    // 로그인하지 않은 경우 홈으로 리다이렉트
    redirect('/');
  }

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <main className="max-w-7xl mx-auto px-4 py-8 lg:px-8 lg:py-16">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">⭐ 내 북마크</h1>
          <p className="text-muted-foreground">
            즐겨찾기한 관광지를 한눈에 확인하세요
          </p>
        </div>

        {/* 북마크 목록 컴포넌트 */}
        <BookmarkList />
      </main>
    </div>
  );
}

