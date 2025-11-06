/**
 * @file bookmark-button.tsx
 * @description 관광지 상세페이지 북마크 버튼 컴포넌트
 *
 * 이 컴포넌트는 관광지를 북마크(즐겨찾기)에 추가/제거하는 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 북마크 추가/제거 토글
 * 2. 인증된 사용자: Supabase DB에 저장
 * 3. 로그인하지 않은 사용자: localStorage 임시 저장 후 로그인 시 동기화
 * 4. 북마크 상태 실시간 표시 (별 아이콘 채워짐/비어있음)
 * 5. 중복 북마크 방지
 *
 * 핵심 구현 로직:
 * - Clerk 인증 상태 확인 (useAuth)
 * - Supabase 클라이언트로 북마크 CRUD (useClerkSupabaseClient)
 * - Clerk user ID → Supabase user ID 매핑
 * - localStorage 임시 저장 (로그인 안 된 경우)
 * - 북마크 상태 실시간 업데이트
 *
 * @dependencies
 * - @clerk/nextjs: useAuth (인증 상태 확인)
 * - lib/supabase/clerk-client: useClerkSupabaseClient (Supabase 클라이언트)
 * - sonner: 토스트 알림
 * - lucide-react: Star 아이콘
 * - components/ui/button: 버튼 컴포넌트
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SignInButton } from '@clerk/nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * localStorage 키 (임시 북마크 저장용)
 */
const TEMP_BOOKMARKS_KEY = 'mytrip_temp_bookmarks';

/**
 * Clerk user ID로 Supabase user ID 조회
 */
async function getSupabaseUserId(
  supabase: SupabaseClient,
  clerkUserId: string,
): Promise<string | null> {
  console.group('[북마크] Supabase user ID 조회');
  console.log('Clerk user ID:', clerkUserId);

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', clerkUserId)
    .single();

  if (error) {
    console.error('Supabase user ID 조회 실패:', error);
    console.groupEnd();
    return null;
  }

  console.log('Supabase user ID:', data?.id);
  console.groupEnd();
  return data?.id || null;
}

/**
 * localStorage에서 임시 북마크 가져오기
 */
function getTempBookmarks(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(TEMP_BOOKMARKS_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as string[];
  } catch {
    return [];
  }
}

/**
 * localStorage에 임시 북마크 저장
 */
function saveTempBookmark(contentId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const bookmarks = getTempBookmarks();
    if (!bookmarks.includes(contentId)) {
      bookmarks.push(contentId);
      localStorage.setItem(TEMP_BOOKMARKS_KEY, JSON.stringify(bookmarks));
      console.log('[북마크] localStorage 임시 저장:', contentId);
    }
  } catch (error) {
    console.error('[북마크] localStorage 저장 실패:', error);
  }
}

/**
 * localStorage에서 임시 북마크 제거
 */
function removeTempBookmark(contentId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const bookmarks = getTempBookmarks();
    const filtered = bookmarks.filter((id) => id !== contentId);
    localStorage.setItem(TEMP_BOOKMARKS_KEY, JSON.stringify(filtered));
    console.log('[북마크] localStorage 임시 제거:', contentId);
  } catch (error) {
    console.error('[북마크] localStorage 제거 실패:', error);
  }
}

interface BookmarkButtonProps {
  /**
   * 관광지 콘텐츠 ID (한국관광공사 API의 contentid)
   */
  contentId: string;
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
 * 북마크 버튼 컴포넌트
 */
export function BookmarkButton({
  contentId,
  size = 'default',
  variant = 'outline',
  className,
}: BookmarkButtonProps) {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const supabase = useClerkSupabaseClient();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 북마크 상태 확인
   */
  const checkBookmarkStatus = useCallback(async () => {
    console.group('[북마크] 상태 확인');
    console.log('Content ID:', contentId);
    console.log('User ID:', userId);
    console.log('Is Signed In:', isSignedIn);

    setIsLoading(true);

    try {
      // 로그인하지 않은 경우: localStorage 확인
      if (!isSignedIn || !userId) {
        const tempBookmarks = getTempBookmarks();
        const bookmarked = tempBookmarks.includes(contentId);
        console.log('[북마크] localStorage 상태:', bookmarked);
        setIsBookmarked(bookmarked);
        setIsLoading(false);
        return;
      }

      // 로그인한 경우: Supabase 확인
      const supabaseUserId = await getSupabaseUserId(supabase, userId);
      if (!supabaseUserId) {
        console.warn('[북마크] Supabase user ID를 찾을 수 없습니다.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', supabaseUserId)
        .eq('content_id', contentId)
        .maybeSingle();

      if (error) {
        console.error('[북마크] 상태 확인 실패:', error);
        setIsLoading(false);
        return;
      }

      const bookmarked = !!data;
      console.log('[북마크] Supabase 상태:', bookmarked);
      setIsBookmarked(bookmarked);
    } catch (error) {
      console.error('[북마크] 상태 확인 중 에러:', error);
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  }, [contentId, userId, isSignedIn, supabase]);

  /**
   * 북마크 토글 (추가/제거)
   */
  const handleBookmark = useCallback(async () => {
    console.group('[북마크] 토글 시작');
    console.log('Content ID:', contentId);
    console.log('현재 상태:', isBookmarked);

    // 로그인하지 않은 경우: localStorage에 임시 저장
    if (!isSignedIn || !userId) {
      if (isBookmarked) {
        removeTempBookmark(contentId);
        setIsBookmarked(false);
        toast.info('북마크가 제거되었습니다. 로그인하면 모든 기기에서 동기화됩니다.');
      } else {
        saveTempBookmark(contentId);
        setIsBookmarked(true);
        toast.info('북마크가 추가되었습니다. 로그인하면 모든 기기에서 동기화됩니다.');
      }
      console.groupEnd();
      return;
    }

    try {
      // Supabase user ID 조회
      const supabaseUserId = await getSupabaseUserId(supabase, userId);
      if (!supabaseUserId) {
        toast.error('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
        console.groupEnd();
        return;
      }

      if (isBookmarked) {
        // 북마크 제거
        console.log('[북마크] 제거 중...');
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', supabaseUserId)
          .eq('content_id', contentId);

        if (error) {
          console.error('[북마크] 제거 실패:', error);
          toast.error('북마크 제거에 실패했습니다.');
          return;
        }

        setIsBookmarked(false);
        toast.success('북마크가 제거되었습니다.');
        console.log('[북마크] 제거 완료');
      } else {
        // 북마크 추가
        console.log('[북마크] 추가 중...');
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: supabaseUserId,
            content_id: contentId,
          });

        if (error) {
          // 중복 북마크 에러 처리
          if (error.code === '23505') {
            console.log('[북마크] 이미 북마크되어 있음');
            setIsBookmarked(true);
            return;
          }
          console.error('[북마크] 추가 실패:', error);
          toast.error('북마크 추가에 실패했습니다.');
          return;
        }

        setIsBookmarked(true);
        toast.success('북마크가 추가되었습니다.');
        console.log('[북마크] 추가 완료');
      }
    } catch (error) {
      console.error('[북마크] 토글 중 에러:', error);
      toast.error('북마크 처리 중 오류가 발생했습니다.');
    } finally {
      console.groupEnd();
    }
  }, [contentId, userId, isSignedIn, isBookmarked, supabase]);

  // 초기 북마크 상태 확인
  useEffect(() => {
    if (!isLoaded) return;
    checkBookmarkStatus();
  }, [isLoaded, checkBookmarkStatus]);

  // 로딩 중
  if (isLoading) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled
        className={className}
        aria-label="북마크 로딩 중"
      >
        <Star className="h-4 w-4 mr-2" />
        북마크
      </Button>
    );
  }

  // 로그인하지 않은 경우: 로그인 유도 버튼
  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button
          variant={variant}
          size={size}
          className={className}
          aria-label="북마크 (로그인 필요)"
        >
          <Star
            className={`h-4 w-4 mr-2 ${
              isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''
            }`}
          />
          북마크
        </Button>
      </SignInButton>
    );
  }

  // 북마크 버튼
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBookmark}
      className={className}
      aria-label={isBookmarked ? '북마크 제거' : '북마크 추가'}
    >
      <Star
        className={`h-4 w-4 mr-2 ${
          isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''
        }`}
      />
      북마크
    </Button>
  );
}

