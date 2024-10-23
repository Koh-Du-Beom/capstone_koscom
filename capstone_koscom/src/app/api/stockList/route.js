import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('itmsNm'); // 검색어 파라미터 받기
  const apiKey = process.env.KRX_ENCODING_KEY;
 
  // API 요청 URL 설정
  let url = `https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=${apiKey}&resultType=json`;

  if (searchTerm) {
    url += `&likeItmsNm=${encodeURIComponent(searchTerm)}`;
  }

  console.log("Request URL:", url);  // 요청 URL 로그

  try {
    // API 요청 보내기 (JSON 형식 응답)
    const response = await axios.get(url);

    // 여기에서 API 응답 데이터 출력
    console.log("Raw API response:", response.data);  // API 응답 데이터 로그
   
    // JSON 응답에서 필요한 데이터가 없을 경우 처리
    if (!response.data || !response.data.response || !response.data.response.body || !response.data.response.body.items || !response.data.response.body.items.item) {
      console.log("No data available");  // 데이터가 없을 경우 로그
      return NextResponse.json([]); // 데이터가 없을 때 빈 배열 반환
    }
      
    // 필요한 데이터 추출 (필요한 필드만 추출)
    const stockItems = response.data.response.body.items.item.map(item => ({
      name: item.itmsNm,            // 종목 이름
      code: item.srtnCd,            // 종목 고유 코드
      priceChange: item.vs,         // 가격 변화 (증가/감소)
      priceChangeRate: item.fltRt,  // 등락률 (증가/감소 비율)
      marketCategory: item.mrktCtg, // 시장 구분
      mkp: item.mkp,                // 시가
    }));

    return NextResponse.json(stockItems); // JSON 데이터 반환
  } catch (error) {
    console.error("Error fetching stock data:", error.message); // 에러 로그
    return NextResponse.json({ error: 'Failed to fetch data from external API' }, { status: 500 });
  }
}
