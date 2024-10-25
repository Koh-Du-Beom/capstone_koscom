import { NextResponse } from 'next/server';
import { parseCSV } from '@/utils/parseCSV';

export async function POST(request) {
  try {
    const { message } = await request.json(); // 입력된 문장 데이터

    // Python 백엔드의 엔드포인트 URL을 설정
    const pythonEndpointUrl = 'https://your-python-api-endpoint-url'; // 실제 Python 엔드포인트 URL로 대체하세요.

    // Python 엔드포인트로 POST 요청을 보내기
    const response = await fetch(pythonEndpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }), // 문장을 JSON 형식으로 전송
    });

    if (!response.ok) {
      throw new Error(`Python 엔드포인트에서 데이터를 불러오는 중 오류 발생: ${response.statusText}`);
    }

    // 응답받은 CSV 데이터를 텍스트로 읽기
    const csvData = await response.text();
    
    // CSV 데이터를 JSON 형식으로 파싱
    const parsedData = await parseCSV(csvData);

    // JSON 데이터를 프론트엔드로 반환
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('getGraphData-prompt API 라우트에서 오류 발생:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
