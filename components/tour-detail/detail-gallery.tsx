/**
 * @file detail-gallery.tsx
 * @description 관광지 이미지 갤러리 섹션 컴포넌트
 *
 * 이 컴포넌트는 관광지 상세 페이지의 이미지 갤러리를 표시합니다.
 *
 * 주요 기능:
 * 1. 관광지 이미지 목록 표시 (detailImage2 API)
 * 2. 이미지 그리드 레이아웃
 * 3. 이미지 클릭 시 모달로 전체화면 보기
 * 4. 이미지 없으면 기본 이미지 표시
 * 5. Next.js Image 컴포넌트로 이미지 최적화
 *
 * 핵심 구현 로직:
 * - Client Component (이미지 클릭 이벤트 처리)
 * - Dialog 컴포넌트로 모달 구현
 * - 그리드 레이아웃으로 이미지 표시
 * - 이미지 로딩 상태 처리
 *
 * @dependencies
 * - lib/types/tour.ts: TourImage 타입
 * - components/ui/dialog.tsx: 이미지 모달
 * - next/image: 이미지 최적화
 * - lucide-react: 아이콘
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import type { TourImage } from '@/lib/types/tour';

interface DetailGalleryProps {
    images: TourImage[];
    defaultImage?: string; // 기본 이미지 (firstimage 등)
}

/**
 * 기본 이미지 URL (이미지가 없을 때 사용)
 */
const DEFAULT_IMAGE = '/logo.png';

export function DetailGallery({ images, defaultImage }: DetailGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // 모든 이미지 URL 수집 (기본 이미지 포함)
    const allImages: string[] = [];

    // 기본 이미지가 있고 유효한 URL이면 추가
    if (defaultImage && defaultImage.trim() !== '' && defaultImage !== DEFAULT_IMAGE) {
        allImages.push(defaultImage);
    }

    // API에서 받은 이미지들 추가
    images.forEach((image) => {
        const imageUrl = image.originimgurl || image.smallimageurl;
        if (imageUrl && imageUrl.trim() !== '' && !allImages.includes(imageUrl)) {
            allImages.push(imageUrl);
        }
    });

    // 이미지가 없으면 기본 이미지만 표시
    if (allImages.length === 0) {
        return (
            <section className="space-y-6">
                <div className="border-b pb-4 mb-6">
                    <h2 className="text-2xl font-semibold">이미지 갤러리</h2>
                </div>
                <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-muted">
                    <Image
                        src={DEFAULT_IMAGE}
                        alt="기본 이미지"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 1200px"
                    />
                </div>
            </section>
        );
    }

    // 이미지가 1개만 있으면 큰 이미지로 표시
    if (allImages.length === 1) {
        return (
            <section className="space-y-6">
                <div className="border-b pb-4 mb-6">
                    <h2 className="text-2xl font-semibold">이미지 갤러리</h2>
                </div>
                <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-muted">
                    <Image
                        src={allImages[0]}
                        alt="관광지 이미지"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 1200px"
                    />
                </div>
            </section>
        );
    }

    // 여러 이미지가 있으면 그리드 레이아웃
    // 첫 번째 이미지는 크게, 나머지는 작게
    const mainImage = allImages[0];
    const thumbnailImages = allImages.slice(1);

    const handleImageClick = (index: number) => {
        setSelectedIndex(index);
        setIsDialogOpen(true);
    };

    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
    };

    return (
        <section className="space-y-6">
            <div className="border-b pb-4 mb-6">
                <h2 className="text-2xl font-semibold">이미지 갤러리</h2>
            </div>

            {/* 메인 이미지 + 썸네일 그리드 */}
            <div className="space-y-4">
                {/* 메인 이미지 */}
                <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-muted cursor-pointer">
                    <Image
                        src={mainImage}
                        alt="관광지 이미지"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 1200px"
                        onClick={() => handleImageClick(0)}
                    />
                </div>

                {/* 썸네일 그리드 */}
                {thumbnailImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {thumbnailImages.map((imageUrl, index) => (
                            <div
                                key={index}
                                className="relative w-full h-[150px] md:h-[200px] rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => handleImageClick(index + 1)}
                            >
                                <Image
                                    src={imageUrl}
                                    alt={`관광지 이미지 ${index + 2}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 이미지 모달 */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* 닫기 버튼 */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </Button>

                        {/* 이전 버튼 */}
                        {allImages.length > 1 && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 z-10 text-white hover:bg-white/20"
                                onClick={handlePrevious}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </Button>
                        )}

                        {/* 이미지 */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={allImages[selectedIndex]}
                                alt={`관광지 이미지 ${selectedIndex + 1}`}
                                width={1200}
                                height={800}
                                className="max-w-full max-h-full object-contain"
                                sizes="100vw"
                            />
                        </div>

                        {/* 다음 버튼 */}
                        {allImages.length > 1 && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 z-10 text-white hover:bg-white/20"
                                onClick={handleNext}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </Button>
                        )}

                        {/* 이미지 인덱스 표시 */}
                        {allImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                                {selectedIndex + 1} / {allImages.length}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}

