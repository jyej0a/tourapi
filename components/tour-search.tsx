/**
 * @file tour-search.tsx
 * @description 관광지 검색 컴포넌트
 *
 * 이 컴포넌트는 키워드로 관광지를 검색하는 UI를 제공합니다.
 *
 * 주요 기능:
 * 1. 검색창 입력 (키워드)
 * 2. 엔터 키 또는 검색 버튼 클릭으로 검색 실행
 * 3. URL searchParams에 keyword 추가하여 서버 컴포넌트 재렌더링
 * 4. 검색 아이콘 표시
 *
 * 핵심 구현 로직:
 * - Client Component로 검색 상태 관리
 * - URL searchParams를 Single Source of Truth로 사용
 * - 필터(areaCode, contentTypeId)와 함께 동작
 * - 검색 키워드가 있으면 검색 API 호출, 없으면 필터 API 호출
 *
 * @dependencies
 * - components/ui/input.tsx: Input 컴포넌트
 * - components/ui/button.tsx: Button 컴포넌트
 * - lucide-react: Search 아이콘
 * - next/navigation: useRouter, useSearchParams
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * 관광지 검색 컴포넌트
 */
export function TourSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 현재 검색 키워드 가져오기 (URL에서)
  const currentKeyword = searchParams.get('keyword') || '';
  const [inputValue, setInputValue] = useState(currentKeyword);

  // URL의 keyword가 변경되면 inputValue 동기화
  useEffect(() => {
    setInputValue(currentKeyword);
  }, [currentKeyword]);

  /**
   * 검색 실행 핸들러
   */
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    const keyword = inputValue.trim();

    // 검색 키워드가 있으면 추가, 없으면 제거
    if (keyword) {
      params.set('keyword', keyword);
    } else {
      params.delete('keyword');
    }

    // pageNo는 검색 시 1로 리셋
    params.delete('pageNo');

    // URL 업데이트
    router.push(`/?${params.toString()}`);
  };

  /**
   * 엔터 키 핸들러
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * 검색창 초기화
   */
  const handleClear = () => {
    setInputValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('keyword');
    params.delete('pageNo');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 w-full max-w-2xl">
      {/* 검색창 */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="관광지명, 주소, 설명으로 검색..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="검색어 지우기"
          >
            ✕
          </button>
        )}
      </div>

      {/* 검색 버튼 */}
      <Button
        onClick={handleSearch}
        className="px-6"
        aria-label="검색"
      >
        <Search className="h-4 w-4 mr-2" />
        검색
      </Button>
    </div>
  );
}

