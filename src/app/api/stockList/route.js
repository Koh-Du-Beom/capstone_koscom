import axios from 'axios';
import { JSDOM } from 'jsdom';
import { NextResponse } from 'next/server';
import iconv from 'iconv-lite';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const stockCode = searchParams.get('code');

  if (!stockCode) {
    return NextResponse.json({ error: 'Stock code is required' }, { status: 400 });
  }

  const url = `https://finance.naver.com/item/main.naver?code=${stockCode}`;

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
    });

    const htmlContent = iconv.decode(response.data, 'EUC-KR');
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    // 종목명
    const nameElement = document.querySelector('.wrap_company h2');
    const name = nameElement ? nameElement.textContent.trim() : '';

    // 현재가 (mkp)
    const mkpElement = document.querySelector('.today .no_today .blind');
    const mkp = mkpElement ? mkpElement.textContent.replace(/,/g, '').trim() : '';

    // 전일 대비 (priceChange) 및 등락률 (priceChangeRate)
    const priceChangeElement = document.querySelector('.no_exday em.no_down, .no_exday em.no_up');
    let priceChange = '';
    let priceChangeRate = '';

    if (priceChangeElement) {
      const isDown = priceChangeElement.querySelector('.ico')?.classList.contains('down');
      const changeValues = priceChangeElement.querySelectorAll('span');

      // changeValues에서 각 숫자 부분을 합쳐서 숫자 값으로 만듭니다.
      let changeText = '';
      changeValues.forEach(span => {
        changeText += span.textContent.trim();
      });

      priceChange = (isDown ? '-' : '') + changeText;

      // 등락률 처리
      const priceChangeRateElement = priceChangeElement.parentElement.querySelector('.per');
      priceChangeRate = priceChangeRateElement
        ? (isDown ? '-' : '') + priceChangeRateElement.textContent.replace('%', '').trim()
        : '';
    }

    // 시장 구분 (marketCategory)
    const marketCategoryElement = document.querySelector('.wrap_company .description img');
    const marketCategory = marketCategoryElement
      ? marketCategoryElement.alt.includes('코스피') ? 'KOSPI' : 'KOSDAQ'
      : '';

    const stockData = {
      name,
      code: stockCode,
      priceChange,
      priceChangeRate,
      marketCategory,
      mkp,
    };

    console.log(stockData); // 데이터 확인용 로그 추가

    return NextResponse.json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    return NextResponse.json({ error: 'Failed to fetch data from external API' }, { status: 500 });
  }
}
