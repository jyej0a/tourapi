/**
 * @file route.ts
 * @description 지역 기반 관광지 목록 조회 API Route
 *
 * 한국관광공사 API의 지역 기반 관광지 목록을 조회하는 엔드포인트입니다.
 *
 * GET /api/tour/list?areaCode=1&contentTypeId=12&numOfRows=10&pageNo=1
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAreaBasedList } from '@/lib/api/tour-api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const areaCode = searchParams.get('areaCode') || undefined;
    const contentTypeId = searchParams.get('contentTypeId') || undefined;
    const numOfRows = parseInt(searchParams.get('numOfRows') || '10', 10);
    const pageNo = parseInt(searchParams.get('pageNo') || '1', 10);

    const result = await getAreaBasedList(
      areaCode,
      contentTypeId,
      numOfRows,
      pageNo,
    );

    return NextResponse.json(
      {
        success: true,
        data: result.items,
        pagination: {
          totalCount: result.totalCount,
          pageNo: result.pageNo,
          numOfRows: result.numOfRows,
          totalPages: Math.ceil(result.totalCount / result.numOfRows),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('관광지 목록 조회 에러:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '관광지 목록을 불러오는 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}

