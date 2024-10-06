import axios from 'axios';
import { NextResponse } from 'next/server';
import xml2js from 'xml2js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('itmsNm'); // 검색어 파라미터 받기
  const apiKey = process.env.KRX_ENCODING_KEY;

  // API URL 수정
  let url = `https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=${apiKey}&resultType=xml`;

  if (searchTerm) {
    url += `&likeItmsNm=${encodeURIComponent(searchTerm)}`;
  }

  try {
    const response = await axios.get(url, { responseType: 'text' });
    const parser = new xml2js.Parser();
    const jsonData = await parser.parseStringPromise(response.data);

    // 콘솔에 응답 데이터 출력
    console.log("Raw API response:", response.data);
    console.log("Parsed JSON data:", jsonData);

    // 데이터가 없을 경우 처리
    if (!jsonData || !jsonData.response || !jsonData.response.body || !jsonData.response.body.items || !jsonData.response.body.items[0].item) {
      console.log("No data available");
      return NextResponse.json([]); // 데이터가 없을 때 빈 배열 반환
    }

    // 필요한 데이터 추출
    const stockItems = jsonData.response.body.items[0].item.map(item => ({
      name: item.itmsNm[0],            // 종목 이름
      code: item.srtnCd[0],            // 종목 고유 코드
      priceChange: item.vs[0],         // 가격 변화 (증가/감소)
      priceChangeRate: item.fltRt[0]   // 등락률 (증가/감소 비율)
    }));

    // 추출한 데이터도 콘솔에 출력
    console.log("Extracted stock items:", stockItems);

    return NextResponse.json(stockItems); // 필요한 데이터 반환
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    return NextResponse.json({ error: 'Failed to fetch data from external API' }, { status: 500 });
  }
}
