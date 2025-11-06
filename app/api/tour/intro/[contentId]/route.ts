/**
 * @file route.ts
 * @description 관광지 운영 정보 조회 API Route
 *
 * 한국관광공사 API의 관광지 운영 정보를 조회하는 엔드포인트입니다.
 *
 * GET /api/tour/intro/125266?contentTypeId=12
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTourIntro } from '@/lib/api/tour-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contentId: string }> },
) {
  try {
    const { contentId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const contentTypeId = searchParams.get('contentTypeId');

    if (!contentId || contentId.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: '콘텐츠 ID를 입력해주세요.',
        },
        { status: 400 },
      );
    }

    if (!contentTypeId || contentTypeId.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: '콘텐츠 타입 ID를 입력해주세요.',
        },
        { status: 400 },
      );
    }

    const intro = await getTourIntro(contentId, contentTypeId);

    if (!intro) {
      return NextResponse.json(
        {
          success: false,
          error: '운영 정보를 찾을 수 없습니다.',
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: intro,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('운영 정보 조회 에러:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '운영 정보를 불러오는 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}

