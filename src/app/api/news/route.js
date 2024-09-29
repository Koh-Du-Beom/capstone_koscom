import axios from 'axios';
import * as cheerio from 'cheerio';

const NAVER_STOCK_NEWS_URL = "https://m.stock.naver.com/investment/news/flashnews";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  if (!search) {
    return new Response(JSON.stringify({ error: "검색어가 제공되지 않았습니다." }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    // 네이버 주식 뉴스 페이지에서 HTML 가져오기
    const { data } = await axios.get(NAVER_STOCK_NEWS_URL);
    const $ = cheerio.load(data);

    const lowerCaseSearch = search.toLowerCase().trim();
    const newsHeadlines = [];

    // 적절한 클래스 선택자를 사용하여 뉴스 타이틀 추출
    $('strong.NewsList_title__XdSpT').each((index, element) => {
      const title = $(element).text().replace(/\s+/g, ' ').trim().toLowerCase(); // 공백 제거 및 소문자 변환
      console.log("Parsed title:", title); // 파싱된 타이틀을 로그로 출력

      if (title.includes(lowerCaseSearch)) {  // 검색어 포함 여부 확인
        newsHeadlines.push({ id: index, title });
      }
    });

    if (newsHeadlines.length === 0) {
      return new Response(JSON.stringify({ error: '검색어와 일치하는 기사가 없습니다.' }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ headlines: newsHeadlines }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: '크롤링에 실패했습니다.' }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
