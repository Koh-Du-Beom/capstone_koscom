import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { stocks, selectedIndicators } = await request.json();

    console.log(selectedIndicators);

    // 요청 데이터 유효성 검사
    if (
      !Array.isArray(stocks) ||
      typeof selectedIndicators !== 'object' ||
      selectedIndicators === null
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid request: stocks must be an array and selectedIndicators must be an object.',
        },
        { status: 400 }
      );
    }

    // 데이터 파일 경로
    const filePath = path.join(
      process.cwd(),
      'src',
      'app',
      'data',
      'data_processed.json'
    );
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const allData = JSON.parse(fileContent);

    // date 필드 추출 및 포맷팅
    const rawDate = allData.data.date;
    const formattedDate = rawDate.split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환

    // 데이터 필터링 및 가공
    const filteredItems = allData.data.items
      .filter((item) => stocks.some((stock) => stock.code === item.ticker)) // 선택된 종목 필터링
      .map((item) => {
        const matchedStock = stocks.find((stock) => stock.code === item.ticker);
        const result = {
          ticker: item.ticker,
          companyName: matchedStock?.name || '', // companyName 추가
        };

        // 선택된 지표에 해당하는 score_ 값을 추출 및 방향에 따른 처리
        Object.keys(selectedIndicators).forEach((indicator) => {
          const scoreKey = `score_${indicator}`;
          if (item[scoreKey] !== undefined) {
            const direction = selectedIndicators[indicator]; // '상향돌파' 또는 '하향돌파'
            let score = item[scoreKey];

            if (direction === '하향돌파') {
              score = 100 - score;
            }

            result[scoreKey] = score;
          }
        });

        return result;
      });

    // 최종 데이터 형식 구성
    const responseData = {
      date: formattedDate,
      items: filteredItems,
    };

    console.log('response data', responseData);

    // 결과 반환
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error processing stock filter data:', error);
    return NextResponse.json(
      { error: 'Failed to process stock filter data' },
      { status: 500 }
    );
  }
}
