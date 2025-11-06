/**
 * @file detail-info.tsx
 * @description 관광지 기본 정보 섹션 컴포넌트
 *
 * 이 컴포넌트는 관광지 상세 페이지의 기본 정보를 표시합니다.
 *
 * 주요 기능:
 * 1. 관광지명, 대표 이미지 표시
 * 2. 주소 표시 및 복사 기능
 * 3. 전화번호 표시 및 클릭 시 전화 연결
 * 4. 홈페이지 링크 표시
 * 5. 개요 정보 표시
 * 6. 관광 타입 및 카테고리 표시
 *
 * 핵심 구현 로직:
 * - Server Component로 데이터를 받아서 표시
 * - 클라이언트 사이드 기능 (복사, 전화)은 별도 클라이언트 컴포넌트로 분리
 * - Next.js Image 컴포넌트로 이미지 최적화
 * - Sonner toast로 알림 메시지 표시
 *
 * @dependencies
 * - lib/types/tour.ts: TourDetail 타입
 * - sonner: 토스트 알림
 * - next/image: 이미지 최적화
 * - lucide-react: 아이콘
 */

'use client';

import Image from 'next/image';
import { Copy, Phone, ExternalLink, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CONTENT_TYPE } from '@/lib/types/tour';
import type { TourDetail } from '@/lib/types/tour';

/**
 * 관광 타입 ID를 한글 이름으로 변환
 */
function getContentTypeName(contentTypeId: string): string {
  const typeMap: Record<string, string> = {
    [CONTENT_TYPE.TOURIST_SPOT]: '관광지',
    [CONTENT_TYPE.CULTURAL_FACILITY]: '문화시설',
    [CONTENT_TYPE.FESTIVAL]: '축제/행사',
    [CONTENT_TYPE.TRAVEL_COURSE]: '여행코스',
    [CONTENT_TYPE.LEISURE_SPORTS]: '레포츠',
    [CONTENT_TYPE.ACCOMMODATION]: '숙박',
    [CONTENT_TYPE.SHOPPING]: '쇼핑',
    [CONTENT_TYPE.RESTAURANT]: '음식점',
  };

  return typeMap[contentTypeId] || '기타';
}

/**
 * 기본 이미지 URL (이미지가 없을 때 사용)
 */
const DEFAULT_IMAGE = '/logo.png';

interface DetailInfoProps {
  detail: TourDetail;
}

/**
 * 주소 복사 기능
 */
function handleCopyAddress(address: string) {
  navigator.clipboard
    .writeText(address)
    .then(() => {
      toast.success('주소가 클립보드에 복사되었습니다.');
    })
    .catch(() => {
      toast.error('주소 복사에 실패했습니다.');
    });
}

/**
 * 전화번호를 클릭 가능한 형식으로 변환
 */
function formatPhoneNumber(tel: string): string {
  // 전화번호에서 하이픈 제거 후 클릭 가능한 형식으로 변환
  return tel.replace(/[-\s]/g, '');
}

/**
 * 홈페이지 URL에서 HTML 태그 제거 및 URL 추출
 */
function extractHomepageUrl(homepage: string): { url: string; displayText: string } {
  // HTML 태그가 포함된 경우 처리
  if (homepage.includes('<a')) {
    // href 속성에서 URL 추출
    const hrefMatch = homepage.match(/href=["']([^"']+)["']/);
    if (hrefMatch && hrefMatch[1]) {
      const url = hrefMatch[1];
      // URL이 http로 시작하지 않으면 https:// 추가
      const finalUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // 표시 텍스트: URL만 표시 (도메인 부분만 또는 전체 URL)
      const urlObj = new URL(finalUrl);
      const displayText = urlObj.hostname + urlObj.pathname;
      
      return {
        url: finalUrl,
        displayText: displayText.length > 50 ? `${displayText.substring(0, 50)}...` : displayText,
      };
    }
  }

  // HTML 태그가 없는 경우 그대로 사용
  let cleanUrl = homepage.trim();
  
  // HTML 태그 제거 (혹시 남아있는 경우)
  cleanUrl = cleanUrl.replace(/<[^>]*>/g, '').trim();
  
  // URL이 http로 시작하지 않으면 https:// 추가
  const finalUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
  
  // 표시 텍스트: URL만 표시
  try {
    const urlObj = new URL(finalUrl);
    const displayText = urlObj.hostname + urlObj.pathname;
    return {
      url: finalUrl,
      displayText: displayText.length > 50 ? `${displayText.substring(0, 50)}...` : displayText,
    };
  } catch {
    // URL 파싱 실패 시 원본 사용 (길면 잘라서)
    return {
      url: finalUrl,
      displayText: cleanUrl.length > 50 ? `${cleanUrl.substring(0, 50)}...` : cleanUrl,
    };
  }
}

export function DetailInfo({ detail }: DetailInfoProps) {
  const imageUrl = detail.firstimage || detail.firstimage2 || DEFAULT_IMAGE;
  const contentTypeName = getContentTypeName(detail.contenttypeid);
  const fullAddress = detail.addr2 ? `${detail.addr1} ${detail.addr2}` : detail.addr1;
  const phoneNumber = detail.tel ? formatPhoneNumber(detail.tel) : null;
  
  // 홈페이지 URL 처리
  const homepageInfo = detail.homepage ? extractHomepageUrl(detail.homepage) : null;

  return (
    <section className="space-y-8">
      {/* 관광지명 및 타입 */}
      <div>
        <h1 className="text-4xl font-bold mb-4">{detail.title}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
            {contentTypeName}
          </span>
        </div>
      </div>

      {/* 대표 이미지 */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={detail.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
        />
      </div>

      {/* 기본 정보 */}
      <div className="space-y-6">
        {/* 주소 */}
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-muted-foreground text-sm mb-1">주소</p>
            <p className="text-base break-words">{fullAddress}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-8 px-3"
              onClick={() => handleCopyAddress(fullAddress)}
            >
              <Copy className="h-4 w-4 mr-1.5" />
              주소 복사
            </Button>
          </div>
        </div>

        {/* 전화번호 */}
        {detail.tel && (
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-sm mb-1">전화번호</p>
              <a
                href={`tel:${phoneNumber}`}
                className="text-base hover:text-primary transition-colors inline-flex items-center gap-1.5"
              >
                {detail.tel}
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {/* 홈페이지 */}
        {homepageInfo && (
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-sm mb-1">홈페이지</p>
              <a
                href={homepageInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base hover:text-primary transition-colors inline-flex items-center gap-1.5 break-all"
              >
                {homepageInfo.displayText}
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 개요 */}
      {detail.overview && (
        <div className="pt-6 border-t">
          <h2 className="text-2xl font-semibold mb-4">개요</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-base leading-relaxed whitespace-pre-line text-foreground">
              {detail.overview}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

