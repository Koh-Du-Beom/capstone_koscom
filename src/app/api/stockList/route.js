import { NextResponse } from 'next/server';
import axios from 'axios';
import iconv from 'iconv-lite';
const cheerio = require('cheerio');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code'); // 종목 코드
  const name = searchParams.get('name'); // 종목명 (파라미터로 전달)
  const marketCategory = searchParams.get('marketCategory'); // 시장 구분 (파라미터로 전달)

  // Naver Finance URL 설정
  const url = `https://finance.naver.com/item/main.naver?code=${code}`;

  try {
    // EUC-KR 인코딩으로 HTML 페이지 가져오기
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    // 응답 데이터를 EUC-KR에서 UTF-8로 변환
    const html = iconv.decode(response.data, 'EUC-KR');

    // Cheerio로 HTML 로드
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
      name,           // 파라미터로 받은 종목명
      code,           // 파라미터로 받은 종목 코드
      priceChange,
      priceChangeRate,
      marketCategory, // 파라미터로 받은 시장 구분
      mkp,
    };

    console.log(stockData);

    return NextResponse.json(stockData); // JSON 형태로 응답
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch data from external source' },
      { status: 500 }
    );
  }
}
