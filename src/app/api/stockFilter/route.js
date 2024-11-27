import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { selectedIndicators } = await request.json();

    if (!Array.isArray(selectedIndicators)) {
      return NextResponse.json({ error: 'Invalid indicators.' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'data_processed.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const allData = JSON.parse(fileContent);

    // Step 1: 각 아이템에 대해 가중치를 적용한 Rating 계산
    const filteredItems = allData.data.items.map((item) => {
      const result = {
        ticker: item.ticker,
        companyName: item.company_name,
        exchange_code: item.exchange_code,
      };

      let rating = 0;

      selectedIndicators.forEach(({ indicator, condition, weight }) => {
        const scoreKey = `score_${indicator}`;

        let score = item[scoreKey];

        if (score !== undefined) {
          // 조건에 따라 점수 조정
          if (condition === '하향돌파') {
            score = 100 - score;
          }

          // 선택된 지표와 점수 추가
          result[scoreKey] = score;

          // 가중치를 적용한 Rating 계산
          rating += score * (weight / 100);
        }
      });

      // Rating 추가
      result['Rating'] = rating;

      return result;
    });

    // Step 2: 백분위 기반의 Rating 점수 정규화
    const ratings = filteredItems.map((item) => item.Rating);
    const sortedRatings = ratings.slice().sort((a, b) => a - b);

    const p5Index = Math.floor(0.05 * (sortedRatings.length - 1));
    const p95Index = Math.ceil(0.95 * (sortedRatings.length - 1));

    const p5Rating = sortedRatings[p5Index];
    const p95Rating = sortedRatings[p95Index];

    const normalizedItems = filteredItems.map((item) => {
      let normalizedRating;

      if (item.Rating <= p5Rating) {
        normalizedRating = 0;
      } else if (item.Rating >= p95Rating) {
        normalizedRating = 100;
      } else {
        normalizedRating = ((item.Rating - p5Rating) / (p95Rating - p5Rating)) * 100;
      }

      return {
        ...item,
        Rating: normalizedRating,
      };
    });


    return NextResponse.json({
      data: {
        date: allData.data.date.split('T')[0],
        items: normalizedItems,
      },
    });
  } catch (error) {
    console.error('Error processing filter:', error);
    return NextResponse.json({ error: 'Failed to process filter data.' }, { status: 500 });
  }
}
