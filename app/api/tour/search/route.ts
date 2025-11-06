/**
 * @file route.ts
 * @description 키워드 검색 API Route
 *
 * 한국관광공사 API의 키워드 검색 기능을 제공하는 엔드포인트입니다.
 *
 * GET /api/tour/search?keyword=경복궁&areaCode=1&contentTypeId=12&numOfRows=10&pageNo=1
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchKeyword } from '@/lib/api/tour-api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');

    if (!keyword || keyword.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: '검색 키워드를 입력해주세요.',
        },
        { status: 400 },
      );
    }

    const areaCode = searchParams.get('areaCode') || undefined;
    const contentTypeId = searchParams.get('contentTypeId') || undefined;
    const numOfRows = parseInt(searchParams.get('numOfRows') || '10', 10);
    const pageNo = parseInt(searchParams.get('pageNo') || '1', 10);

    const result = await searchKeyword(
      keyword,
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
    console.error('키워드 검색 에러:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '검색 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}

