import { NextResponse } from 'next/server';
import axios from 'axios';
import iconv from 'iconv-lite'; // 인코딩 변환을 위한 라이브러리
const cheerio = require('cheerio');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code'); // 주식 코드 파라미터 받기
  const stockName = searchParams.get('stockName'); // 주식 이름 파라미터 받기

  // 네이버 금융 URL 설정
  const url = `https://finance.naver.com/item/main.naver?code=${code}`;

  try {
    // HTML 페이지 가져오기 (EUC-KR 인코딩 처리)
    const response = await axios.get(url, {
      responseType: 'arraybuffer', // 바이너리 데이터로 받기
    });

    // 응답 데이터를 EUC-KR에서 UTF-8로 변환
    const html = iconv.decode(response.data, 'EUC-KR');

    // Cheerio를 사용하여 HTML 파싱
    const $ = cheerio.load(html);

    // 뉴스 항목 가져오기
    const newsItems = [];
    $('div.sub_section.news_section ul li').each((index, element) => {
      const title = $(element).find('a').text().trim();
      const link = 'https://finance.naver.com' + $(element).find('a').attr('href');
      const date = $(element).children('em').text().trim();

      newsItems.push({ title, link, date });
    });

    // 결과 데이터에 stockName 추가
    const result = {
      stockName,
      stockCode: code,
      newsItems,
    };
    
    return NextResponse.json(result); // 헤더와 함께 JSON 데이터 반환
  } catch (error) {
    console.error('뉴스 데이터를 가져오는 중 오류 발생:', error.message);
    return NextResponse.json({ error: 'Failed to fetch data from external source' }, { status: 500 });
  }
}
