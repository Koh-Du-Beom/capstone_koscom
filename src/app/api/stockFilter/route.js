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

    const ratings = filteredItems.map((item) => item.Rating);
    const sortedRatings = [...new Set(ratings)].sort((a, b) => a - b);
    const totalItems = sortedRatings.length;

    const normalizedItems = filteredItems.map((item) => {
      const count = sortedRatings.filter((r) => r <= item.Rating).length;
      const percentileRank = ((count - 1) / (totalItems - 1)) * 100;

      return {
        ...item,
        Rating: percentileRank,
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
