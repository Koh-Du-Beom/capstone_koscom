import axios from 'axios';
import { NextResponse } from 'next/server';
import xml2js from 'xml2js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('itmsNm'); // 검색어 파라미터 받기
  const apiKey = process.env.KRX_ENCODING_KEY;

  // API 요청 URL 설정
  let url = `https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=${apiKey}&resultType=xml`;

  if (searchTerm) {
    url += `&likeItmsNm=${encodeURIComponent(searchTerm)}`;
  }

  try {
    // API 요청 보내기 (XML 형식 응답)
    const response = await axios.get(url, { responseType: 'text' });
    console.log("Raw API response:", response.data); // 원본 XML 데이터 확인

    // XML을 JSON으로 변환
    const parser = new xml2js.Parser({ explicitArray: false }); // 배열로 처리하지 않도록 옵션 설정
    const jsonData = await parser.parseStringPromise(response.data);
    console.log("Parsed JSON data:", JSON.stringify(jsonData, null, 2)); // JSON 데이터 구조 확인

    // 데이터가 없을 경우 처리
    if (!jsonData || !jsonData.response || !jsonData.response.body || !jsonData.response.body.items || !jsonData.response.body.items.item) {
      console.log("No data available");
      return NextResponse.json([]); // 데이터가 없을 때 빈 배열 반환
    }

    // 필요한 데이터 추출 (필요한 필드만 추출)
    const stockItems = jsonData.response.body.items.item.map(item => ({
      name: item.itmsNm,            // 종목 이름
      code: item.srtnCd,            // 종목 고유 코드
      priceChange: item.vs,         // 가격 변화 (증가/감소)
      priceChangeRate: item.fltRt,   // 등락률 (증가/감소 비율)
			marketCategory: item.mrktCtg,		// 시장 구분
			mkp : item.mkp, 								// 시가
    }));

    console.log("Extracted stock items:", stockItems); // 추출한 데이터 확인

    return NextResponse.json(stockItems); // JSON 데이터 반환
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    return NextResponse.json({ error: 'Failed to fetch data from external API' }, { status: 500 });
  }
}
