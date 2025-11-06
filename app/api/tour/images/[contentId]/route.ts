/**
 * @file route.ts
 * @description 관광지 이미지 목록 조회 API Route
 *
 * 한국관광공사 API의 관광지 이미지 목록을 조회하는 엔드포인트입니다.
 *
 * GET /api/tour/images/125266?numOfRows=20&pageNo=1
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTourImages } from '@/lib/api/tour-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contentId: string }> },
) {
  try {
    const { contentId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const numOfRows = parseInt(searchParams.get('numOfRows') || '20', 10);
    const pageNo = parseInt(searchParams.get('pageNo') || '1', 10);

    if (!contentId || contentId.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: '콘텐츠 ID를 입력해주세요.',
        },
        { status: 400 },
      );
    }

    const images = await getTourImages(contentId, numOfRows, pageNo);

    return NextResponse.json(
      {
        success: true,
        data: images,
        count: images.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('이미지 목록 조회 에러:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '이미지 목록을 불러오는 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}

