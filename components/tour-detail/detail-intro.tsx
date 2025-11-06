/**
 * @file detail-intro.tsx
 * @description 관광지 운영 정보 섹션 컴포넌트
 *
 * 이 컴포넌트는 관광지 상세 페이지의 운영 정보를 표시합니다.
 *
 * 주요 기능:
 * 1. 운영시간/개장시간 표시
 * 2. 휴무일 표시
 * 3. 이용요금 표시
 * 4. 주차 가능 여부 표시
 * 5. 수용인원 표시
 * 6. 체험 프로그램 정보 표시
 * 7. 유모차/반려동물 동반 가능 여부 표시
 *
 * 핵심 구현 로직:
 * - Server Component로 데이터를 받아서 표시
 * - 정보가 없는 항목은 숨김 처리
 * - 아이콘과 함께 정보 표시
 * - 기존 detail-info.tsx의 스타일과 일관성 유지
 *
 * @dependencies
 * - lib/types/tour.ts: TourIntro 타입
 * - lucide-react: 아이콘
 */

'use client';

import {
    Clock,
    Calendar,
    DollarSign,
    ParkingCircle,
    Users,
    Baby,
    Dog,
    Info,
} from 'lucide-react';
import type { TourIntro } from '@/lib/types/tour';

interface DetailIntroProps {
    intro: TourIntro | null;
}

/**
 * HTML 태그를 제거하고 줄바꿈 태그를 실제 줄바꿈으로 변환
 * @param html HTML이 포함될 수 있는 문자열
 * @returns HTML 태그가 제거되고 줄바꿈이 적용된 깨끗한 텍스트
 */
function cleanHtmlText(html: string): string {
    if (!html) return '';

    // <br>, <br/>, <br />, <BR> 등 모든 형태의 br 태그를 줄바꿈으로 변환
    let cleaned = html.replace(/<br\s*\/?>/gi, '\n');

    // 나머지 모든 HTML 태그 제거
    cleaned = cleaned.replace(/<[^>]*>/g, '');

    // HTML 엔티티 디코딩 (예: &nbsp; → 공백, &amp; → &)
    cleaned = cleaned
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    // 연속된 공백 및 줄바꿈 정리
    cleaned = cleaned.replace(/[ \t]+/g, ' '); // 연속된 공백을 하나로
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n'); // 3개 이상의 줄바꿈을 2개로

    return cleaned.trim();
}

/**
 * 정보 항목 컴포넌트
 */
function InfoItem({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | undefined;
}) {
    if (!value || value.trim() === '') {
        return null;
    }

    // HTML 태그 정리
    const cleanedValue = cleanHtmlText(value);

    return (
        <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-muted-foreground text-sm mb-1">{label}</p>
                <p className="text-base break-words whitespace-pre-line">{cleanedValue}</p>
            </div>
        </div>
    );
}

/**
 * 예/아니오 형식의 정보 항목 컴포넌트
 */
function YesNoItem({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | undefined;
}) {
    if (!value || value.trim() === '') {
        return null;
    }

    // HTML 태그 정리
    const cleanedValue = cleanHtmlText(value);

    // 값이 "Y", "1", "가능" 등이면 예, 그 외는 값을 그대로 표시
    const isYes = cleanedValue.toLowerCase().includes('y') ||
        cleanedValue.includes('1') ||
        cleanedValue.includes('가능') ||
        cleanedValue.includes('예');

    return (
        <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-muted-foreground text-sm mb-1">{label}</p>
                <p className="text-base">
                    {isYes ? (
                        <span className="text-green-600 dark:text-green-400">가능</span>
                    ) : (
                        cleanedValue
                    )}
                </p>
            </div>
        </div>
    );
}

export function DetailIntro({ intro }: DetailIntroProps) {
    // 데이터가 없으면 아무것도 표시하지 않음
    if (!intro) {
        return null;
    }

    // 표시할 정보가 하나라도 있는지 확인
    const hasAnyInfo =
        intro.usetime ||
        intro.restdate ||
        intro.usefee ||
        intro.usetimeculture ||
        intro.expagerange ||
        intro.expguide ||
        intro.parking ||
        intro.accomcount ||
        intro.accomcountculture ||
        intro.chkbabycarriage ||
        intro.chkpet ||
        intro.infocenter;

    // 정보가 없으면 아무것도 표시하지 않음
    if (!hasAnyInfo) {
        return null;
    }

    return (
        <section className="space-y-6">
            {/* 제목 */}
            <div className="border-b pb-4 mb-6">
                <h2 className="text-2xl font-semibold">운영 정보</h2>
            </div>

            {/* 정보 목록 */}
            <div className="space-y-6">
                {/* 운영시간/이용시간 */}
                <InfoItem
                    icon={Clock}
                    label="운영시간"
                    value={intro.usetime || intro.usetimeculture}
                />

                {/* 휴무일 */}
                <InfoItem icon={Calendar} label="휴무일" value={intro.restdate} />

                {/* 이용요금 */}
                <InfoItem icon={DollarSign} label="이용요금" value={intro.usefee} />

                {/* 체험 연령/가이드 */}
                {intro.expagerange && (
                    <InfoItem icon={Info} label="체험 연령" value={intro.expagerange} />
                )}

                {intro.expguide && (
                    <InfoItem icon={Info} label="체험 안내" value={intro.expguide} />
                )}

                {/* 주차 */}
                <InfoItem icon={ParkingCircle} label="주차" value={intro.parking} />

                {/* 수용인원 */}
                <InfoItem
                    icon={Users}
                    label="수용인원"
                    value={intro.accomcount || intro.accomcountculture}
                />

                {/* 유모차 동반 */}
                <YesNoItem
                    icon={Baby}
                    label="유모차 동반"
                    value={intro.chkbabycarriage}
                />

                {/* 반려동물 동반 */}
                <YesNoItem icon={Dog} label="반려동물 동반" value={intro.chkpet} />

                {/* 문의처 */}
                <InfoItem icon={Info} label="문의처" value={intro.infocenter} />
            </div>
        </section>
    );
}

