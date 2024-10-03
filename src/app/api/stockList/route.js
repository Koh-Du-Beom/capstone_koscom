import axios from 'axios';
import { NextResponse } from 'next/server';
import xml2js from 'xml2js';

export async function GET() {
  const apiKey = process.env.KRX_DECODING_KEY;
  const url = `https://apis.data.go.kr/1160100/service/GetKrxListedInfoService/getItemInfo?serviceKey=${apiKey}&pageNo=1&numOfRows=10`;

  try {
    // API 요청 보내기
    const response = await axios.get(url, { responseType: 'text' }); // XML로 요청하기
    console.log('Raw XML Response:', response.data); // XML 응답 출력
    
    // XML을 JSON으로 변환
    const parser = new xml2js.Parser();
    const jsonData = await parser.parseStringPromise(response.data);

    console.log('Parsed JSON Data:', jsonData); // 파싱된 JSON 출력

    // JSON 구조 확인 및 데이터 추출
    if (!jsonData || !jsonData.response || !jsonData.response.body || !jsonData.response.body[0].items[0].item) {
      throw new Error('Invalid response structure');
    }

    const stockItems = jsonData.response.body[0].items[0].item.map(item => ({
      code: item.srtnCd[0],  // 종목 코드
      name: item.itmsNm[0],  // 종목 이름
    }));

    return NextResponse.json(stockItems);
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    return NextResponse.json({ error: 'Failed to fetch data from external API' }, { status: 500 });
  }
}
