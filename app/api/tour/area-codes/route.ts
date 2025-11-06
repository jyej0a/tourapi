/**
 * @file route.ts
 * @description 지역 코드 조회 API Route
 *
 * 한국관광공사 API의 지역 코드를 조회하는 엔드포인트입니다.
 *
 * GET /api/tour/area-codes?numOfRows=50&pageNo=1
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAreaCodes } from '@/lib/api/tour-api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const numOfRows = parseInt(searchParams.get('numOfRows') || '50', 10);
    const pageNo = parseInt(searchParams.get('pageNo') || '1', 10);

    const areaCodes = await getAreaCodes(numOfRows, pageNo);

    return NextResponse.json(
      {
        success: true,
        data: areaCodes,
        count: areaCodes.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('지역 코드 조회 에러:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '지역 코드를 불러오는 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}

