import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { reconstructData } from '@/utils/dropdowndata-reconstruction';

export async function POST(request) {
  try {
    const { selectedStocks } = await request.json();

    // selectedStocks가 배열인지 확인하고 비어있으면 에러 반환
    if (!Array.isArray(selectedStocks) || selectedStocks.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input: "selectedStocks" must be a non-empty array.' },
        { status: 400 }
      );
    }

    // 모든 주식 데이터 불러오기 및 재구성
    const stockDataPromises = selectedStocks.map(async (stock) => {
      const filePath = path.resolve(`/home/ubuntu-server/financial_statement/${stock}.json`);

      return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading file for stock ${stock}:`, err.message);
            resolve({ error: `Failed to load data for ${stock}` });
          } else {
            try {
              const jsonData = JSON.parse(data);
              // reconstructData 함수로 데이터 재구성
              const reconstructedData = reconstructData(jsonData);
              resolve({ stockName: stock, data: reconstructedData });
            } catch (parseError) {
              console.error(`JSON parsing error for stock ${stock}:`, parseError.message);
              resolve({ error: `Failed to parse data for ${stock}` });
            }
          }
        });
      });
    });

    // 모든 Promise가 완료될 때까지 기다림
    const allStockData = await Promise.all(stockDataPromises);

    console.log(allStockData);
    

    // JSON 데이터로 응답 반환
    return NextResponse.json(allStockData);
  } catch (error) {
    console.error('Error in getGraphData-checkBox API route:', error);
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
