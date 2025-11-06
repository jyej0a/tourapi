/**
 * @file bookmark-list.tsx
 * @description 북마크 목록 컴포넌트
 *
 * 이 컴포넌트는 사용자가 북마크한 관광지 목록을 표시하고 관리합니다.
 *
 * 주요 기능:
 * 1. 북마크 목록 표시 (카드 레이아웃)
 * 2. 정렬 옵션 (최신순, 이름순, 지역별)
 * 3. 일괄 삭제 기능 (체크박스 선택)
 * 4. 개별 삭제 기능
 * 5. 빈 상태 UI (북마크가 없을 때)
 *
 * 핵심 구현 로직:
 * - Supabase에서 북마크 목록 가져오기
 * - 각 북마크의 content_id로 관광지 정보 가져오기 (한국관광공사 API)
 * - 정렬 및 필터링 처리
 * - 북마크 삭제 기능
 *
 * @dependencies
 * - @clerk/nextjs: useAuth (인증 상태 확인)
 * - lib/supabase/clerk-client: useClerkSupabaseClient (Supabase 클라이언트)
 * - lib/api/tour-api: getTourDetail (관광지 정보 조회)
 * - components/tour-card.tsx: TourCard (관광지 카드)
 * - components/ui/select: Select (정렬 옵션)
 * - components/ui/button: Button (삭제 버튼)
 * - components/ui/checkbox: Checkbox (일괄 선택)
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Star, Trash2, CheckSquare, Square } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { TourCard } from '@/components/tour-card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { TourCardSkeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import type { TourItem } from '@/lib/types/tour';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * 북마크 타입
 */
interface Bookmark {
  id: string;
  user_id: string;
  content_id: string;
  created_at: string;
}

/**
 * 북마크 + 관광지 정보 조합 타입
 */
interface BookmarkWithTour {
  bookmark: Bookmark;
  tour: TourItem | null;
}

/**
 * 정렬 옵션
 */
type SortOption = 'latest' | 'name' | 'region';

/**
 * Clerk user ID로 Supabase user ID 조회
 */
async function getSupabaseUserId(
  supabase: SupabaseClient,
  clerkUserId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', clerkUserId)
    .single();

  if (error) {
    console.error('[북마크 목록] Supabase user ID 조회 실패:', error);
    return null;
  }

  return data?.id || null;
}

/**
 * 북마크 목록 컴포넌트
 */
export function BookmarkList() {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const supabase = useClerkSupabaseClient();
  const [bookmarks, setBookmarks] = useState<BookmarkWithTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortOption, setSortOption] = useState<SortOption>('latest');

  /**
   * 북마크 목록 가져오기
   */
  const fetchBookmarks = useCallback(async () => {
    console.group('[북마크 목록] 데이터 가져오기');
    setIsLoading(true);

    try {
      if (!isSignedIn || !userId) {
        console.log('[북마크 목록] 로그인하지 않음');
        setIsLoading(false);
        return;
      }

      // Supabase user ID 조회
      const supabaseUserId = await getSupabaseUserId(supabase, userId);
      if (!supabaseUserId) {
        console.error('[북마크 목록] Supabase user ID를 찾을 수 없습니다.');
        toast.error('사용자 정보를 찾을 수 없습니다.');
        setIsLoading(false);
        return;
      }

      // 북마크 목록 가져오기
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', supabaseUserId)
        .order('created_at', { ascending: false });

      if (bookmarksError) {
        console.error('[북마크 목록] 북마크 조회 실패:', bookmarksError);
        toast.error('북마크 목록을 불러오는데 실패했습니다.');
        setIsLoading(false);
        return;
      }

      if (!bookmarksData || bookmarksData.length === 0) {
        console.log('[북마크 목록] 북마크 없음');
        setBookmarks([]);
        setIsLoading(false);
        return;
      }

      console.log('[북마크 목록] 북마크 개수:', bookmarksData.length);

      // 각 북마크의 관광지 정보 가져오기 (병렬 처리)
      const bookmarkWithTours = await Promise.all(
        bookmarksData.map(async (bookmark) => {
          try {
            // API Route를 통해 관광지 정보 가져오기
            const response = await fetch(
              `/api/tour/detail/${bookmark.content_id}`,
            );

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            if (!result.success || !result.data) {
              throw new Error(result.error || '관광지 정보를 찾을 수 없습니다');
            }

            const tourDetail = result.data;
            // TourDetail을 TourItem로 변환 (필요한 필드만)
            const tour: TourItem | null = tourDetail
              ? {
                  contentid: tourDetail.contentid,
                  contenttypeid: tourDetail.contenttypeid,
                  title: tourDetail.title,
                  addr1: tourDetail.addr1,
                  addr2: tourDetail.addr2,
                  areacode: '', // TourDetail에는 없으므로 빈 문자열
                  mapx: tourDetail.mapx,
                  mapy: tourDetail.mapy,
                  firstimage: tourDetail.firstimage,
                  firstimage2: tourDetail.firstimage2,
                  tel: tourDetail.tel,
                  modifiedtime: '', // TourDetail에는 없으므로 빈 문자열
                }
              : null;

            return {
              bookmark,
              tour,
            };
          } catch (error) {
            console.error(
              `[북마크 목록] 관광지 정보 조회 실패 (${bookmark.content_id}):`,
              error,
            );
            return {
              bookmark,
              tour: null,
            };
          }
        }),
      );

      console.log('[북마크 목록] 데이터 가져오기 완료');
      setBookmarks(bookmarkWithTours);
    } catch (error) {
      console.error('[북마크 목록] 데이터 가져오기 실패:', error);
      toast.error('북마크 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  }, [isSignedIn, userId, supabase]);

  /**
   * 정렬된 북마크 목록
   */
  const sortedBookmarks = useMemo(() => {
    const sorted = [...bookmarks];

    switch (sortOption) {
      case 'latest':
        // 최신순 (created_at 내림차순)
        sorted.sort(
          (a, b) =>
            new Date(b.bookmark.created_at).getTime() -
            new Date(a.bookmark.created_at).getTime(),
        );
        break;
      case 'name':
        // 이름순 (가나다순)
        sorted.sort((a, b) => {
          const nameA = a.tour?.title || '';
          const nameB = b.tour?.title || '';
          return nameA.localeCompare(nameB, 'ko');
        });
        break;
      case 'region':
        // 지역별 (주소 기준)
        sorted.sort((a, b) => {
          const addrA = a.tour?.addr1 || '';
          const addrB = b.tour?.addr1 || '';
          return addrA.localeCompare(addrB, 'ko');
        });
        break;
    }

    return sorted;
  }, [bookmarks, sortOption]);

  /**
   * 개별 북마크 삭제
   */
  const handleDelete = useCallback(
    async (bookmarkId: string) => {
      console.group('[북마크 목록] 개별 삭제');
      console.log('Bookmark ID:', bookmarkId);

      try {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', bookmarkId);

        if (error) {
          console.error('[북마크 목록] 삭제 실패:', error);
          toast.error('북마크 삭제에 실패했습니다.');
          return;
        }

        // 목록에서 제거
        setBookmarks((prev) =>
          prev.filter((item) => item.bookmark.id !== bookmarkId),
        );
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(bookmarkId);
          return next;
        });

        toast.success('북마크가 삭제되었습니다.');
        console.log('[북마크 목록] 삭제 완료');
      } catch (error) {
        console.error('[북마크 목록] 삭제 중 에러:', error);
        toast.error('북마크 삭제 중 오류가 발생했습니다.');
      } finally {
        console.groupEnd();
      }
    },
    [supabase],
  );

  /**
   * 일괄 삭제
   */
  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.size === 0) {
      toast.info('삭제할 북마크를 선택해주세요.');
      return;
    }

    console.group('[북마크 목록] 일괄 삭제');
    console.log('선택된 북마크 개수:', selectedIds.size);

    try {
      const bookmarkIds = Array.from(selectedIds);
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .in('id', bookmarkIds);

      if (error) {
        console.error('[북마크 목록] 일괄 삭제 실패:', error);
        toast.error('북마크 삭제에 실패했습니다.');
        return;
      }

      // 목록에서 제거
      setBookmarks((prev) =>
        prev.filter((item) => !selectedIds.has(item.bookmark.id)),
      );
      setSelectedIds(new Set());

      toast.success(`${selectedIds.size}개의 북마크가 삭제되었습니다.`);
      console.log('[북마크 목록] 일괄 삭제 완료');
    } catch (error) {
      console.error('[북마크 목록] 일괄 삭제 중 에러:', error);
      toast.error('북마크 삭제 중 오류가 발생했습니다.');
    } finally {
      console.groupEnd();
    }
  }, [selectedIds, supabase]);

  /**
   * 전체 선택/해제
   */
  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === sortedBookmarks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(
        new Set(sortedBookmarks.map((item) => item.bookmark.id)),
      );
    }
  }, [selectedIds.size, sortedBookmarks]);

  // 초기 데이터 로드
  useEffect(() => {
    if (!isLoaded) return;
    fetchBookmarks();
  }, [isLoaded, fetchBookmarks]);

  // 로그인하지 않은 경우
  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Star className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">로그인이 필요합니다</h2>
        <p className="text-muted-foreground mb-4">
          북마크 기능을 사용하려면 먼저 로그인해주세요.
        </p>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <TourCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // 빈 상태
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Star className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          아직 북마크한 관광지가 없습니다
        </h2>
        <p className="text-muted-foreground mb-6">
          관광지를 북마크하면 여기에 표시됩니다.
        </p>
        <Link href="/">
          <Button>관광지 둘러보기</Button>
        </Link>
      </div>
    );
  }

  // 북마크 목록 표시
  return (
    <div>
      {/* 컨트롤 바 */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            총 {bookmarks.length}개
          </span>
          {selectedIds.size > 0 && (
            <span className="text-sm font-medium text-primary">
              {selectedIds.size}개 선택됨
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 정렬 옵션 */}
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="name">이름순</SelectItem>
              <SelectItem value="region">지역별</SelectItem>
            </SelectContent>
          </Select>

          {/* 전체 선택 버튼 */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleSelectAll}
            aria-label="전체 선택"
          >
            {selectedIds.size === sortedBookmarks.length ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
          </Button>

          {/* 일괄 삭제 버튼 */}
          {selectedIds.size > 0 && (
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              삭제 ({selectedIds.size})
            </Button>
          )}
        </div>
      </div>

      {/* 북마크 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedBookmarks.map((item) => {
          const isSelected = selectedIds.has(item.bookmark.id);

          if (!item.tour) {
            // 관광지 정보를 가져오지 못한 경우
            return (
              <div
                key={item.bookmark.id}
                className="border rounded-lg p-4 flex flex-col gap-2 bg-muted"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">
                      관광지 정보를 불러올 수 없습니다
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      콘텐츠 ID: {item.bookmark.content_id}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.bookmark.id)}
                    aria-label="북마크 삭제"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  이 관광지가 삭제되었거나 API에서 제공하지 않는 정보일 수 있습니다.
                </p>
              </div>
            );
          }

          // 북마크 날짜 포맷팅
          const bookmarkDate = new Date(item.bookmark.created_at);
          const formattedDate = bookmarkDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });

          return (
            <div key={item.bookmark.id} className="relative group">
              {/* 체크박스 */}
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    setSelectedIds((prev) => {
                      const next = new Set(prev);
                      if (checked) {
                        next.add(item.bookmark.id);
                      } else {
                        next.delete(item.bookmark.id);
                      }
                      return next;
                    });
                  }}
                  className="bg-background/80 backdrop-blur"
                />
              </div>

              {/* 삭제 버튼 */}
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.bookmark.id)}
                  className="bg-background/80 backdrop-blur hover:bg-destructive/10"
                  aria-label="북마크 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* 관광지 카드 */}
              <TourCard tour={item.tour} bookmarkDate={formattedDate} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

