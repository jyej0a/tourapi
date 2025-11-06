/**
 * @file route.ts
 * @description 관광지 상세 정보 조회 API Route
 *
 * 한국관광공사 API의 관광지 상세 정보를 조회하는 엔드포인트입니다.
 *
 * GET /api/tour/detail/125266
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTourDetail } from '@/lib/api/tour-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contentId: string }> },
) {
  try {
    const { contentId } = await params;

    if (!contentId || contentId.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: '콘텐츠 ID를 입력해주세요.',
        },
        { status: 400 },
      );
    }

    const detail = await getTourDetail(contentId);

    if (!detail) {
      return NextResponse.json(
        {
          success: false,
          error: '관광지 정보를 찾을 수 없습니다.',
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: detail,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('상세 정보 조회 에러:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '상세 정보를 불러오는 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}

