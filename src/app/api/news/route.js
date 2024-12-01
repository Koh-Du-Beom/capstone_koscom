// pages/api/news.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import iconv from 'iconv-lite'; // 인코딩 변환을 위한 라이브러리
const cheerio = require('cheerio');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const codesParam = searchParams.get('codes'); // 콤마로 구분된 주식 코드들
  const stockNamesParam = searchParams.get('stockNames'); // 콤마로 구분된 주식 이름들

  if (!codesParam || !stockNamesParam) {
    return NextResponse.json(
      { error: 'codes and stockNames are required' },
      { status: 400 }
    );
  }

  const codes = codesParam.split(',');
  const stockNames = stockNamesParam.split(',');

  if (codes.length !== stockNames.length) {
    return NextResponse.json(
      { error: 'codes and stockNames must have the same length' },
      { status: 400 }
    );
  }

  try {
    const newsPromises = codes.map(async (code, index) => {
      const stockName = stockNames[index];
      const url = `https://finance.naver.com/item/main.naver?code=${code}`;

      try {
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
        });

        const html = iconv.decode(response.data, 'EUC-KR');
        const $ = cheerio.load(html);

        // 뉴스 항목 가져오기
        const newsItems = [];
        $('div.sub_section.news_section ul li').each((index, element) => {
          const title = $(element).find('a').text().trim();
          const link = 'https://finance.naver.com' + $(element).find('a').attr('href');
          const date = $(element).children('em').text().trim();

          newsItems.push({ title, link, date });
        });

        return {
          stockName,
          stockCode: code,
          newsItems,
        };
      } catch (error) {
        console.error(`뉴스 데이터를 가져오는 중 오류 발생 (종목 코드: ${code}):`, error.message);
        return null; // 실패한 경우 null 반환
      }
    });

    const allNewsData = await Promise.all(newsPromises);

    // 실패한 종목을 제외하고 반환
    const validNewsData = allNewsData.filter((data) => data !== null);

    return NextResponse.json(validNewsData); // JSON 형태로 응답
  } catch (error) {
    console.error('뉴스 데이터를 가져오는 중 오류 발생:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch data from external source' },
      { status: 500 }
    );
  }
}
