// pages/api/stockList.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import iconv from 'iconv-lite';
const cheerio = require('cheerio');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const codesParam = searchParams.get('codes'); // 콤마로 구분된 종목 코드들
  const namesParam = searchParams.get('names'); // 콤마로 구분된 종목명들
  const marketCategoriesParam = searchParams.get('marketCategories'); // 콤마로 구분된 시장 구분들

  if (!codesParam || !namesParam || !marketCategoriesParam) {
    return NextResponse.json(
      { error: 'codes, names, marketCategories are required' },
      { status: 400 }
    );
  }

  const codes = codesParam.split(',');
  const names = namesParam.split(',');
  const marketCategories = marketCategoriesParam.split(',');

  if (codes.length !== names.length || codes.length !== marketCategories.length) {
    return NextResponse.json(
      { error: 'codes, names, marketCategories must have the same length' },
      { status: 400 }
    );
  }

  try {
    const stockDataPromises = codes.map(async (code, index) => {
      const name = names[index];
      const marketCategory = marketCategories[index];

      const url = `https://finance.naver.com/item/main.naver?code=${code}`;

      try {
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
        });

        const html = iconv.decode(response.data, 'EUC-KR');
        const $ = cheerio.load(html);

        // 가격 변동 텍스트 추출
        const priceChangeText = $('p.no_exday em').first().text().trim();

        // 가격 변동 부호 결정
        let priceChangeSign = 1;

        if (priceChangeText.includes('하락')) {
          priceChangeSign = -1;
        } else if (priceChangeText.includes('상승')) {
          priceChangeSign = 1;
        } else {
          priceChangeSign = 1; // 기본값
        }

        // 가격 변동 숫자 부분만 추출
        const priceChangeValueMatch = priceChangeText.match(/[\d,\.]+/);
        let priceChangeValue = priceChangeValueMatch ? priceChangeValueMatch[0] : '0';

        // 쉼표 제거 및 숫자로 변환
        priceChangeValue = parseFloat(priceChangeValue.replace(/,/g, ''));

        // 부호 적용
        const priceChange = (priceChangeSign * priceChangeValue).toString();

        // 등락률 텍스트 추출
        const priceChangeRateText = $('p.no_exday em').eq(1).find('span.blind').text().trim();

        // 공백 및 줄바꿈 제거
        const priceChangeRateTextClean = priceChangeRateText.replace(/\s+/g, '');

        // 등락률 숫자 부분만 추출 (부호 포함)
        const priceChangeRateMatch = priceChangeRateTextClean.match(/([-+]?\d+(\.\d+)?)/);

        let priceChangeRateValue;
        if (priceChangeRateMatch && priceChangeRateMatch[1]) {
          priceChangeRateValue = parseFloat(priceChangeRateMatch[1]);
        } else {
          priceChangeRateValue = 0;
        }

        // 부호를 priceChangeSign에 맞게 적용
        priceChangeRateValue = priceChangeSign * Math.abs(priceChangeRateValue);

        const priceChangeRate = priceChangeRateValue.toString();

        // 매매 기준가 (현재가) 추출
        const mkpText = $('p.no_today .blind').first().text().trim();
        const mkp = mkpText.replace(/,/g, ''); // 쉼표 제거

        // 추출한 데이터를 객체로 생성
        const stockData = {
          name,
          code,
          priceChange,
          priceChangeRate,
          marketCategory,
          mkp,
        };

        return stockData;
      } catch (error) {
        console.error(`Error fetching stock data for code ${code}:`, error.message);
        return null; // 실패한 경우 null 반환
      }
    });

    const stockDataList = await Promise.all(stockDataPromises);

    // 실패한 종목을 제외하고 반환
    const validStockDataList = stockDataList.filter((data) => data !== null);

    return NextResponse.json(validStockDataList); // JSON 형태로 응답
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch data from external source' },
      { status: 500 }
    );
  }
}
