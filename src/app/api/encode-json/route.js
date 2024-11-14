// /app/api/encode-json/route.js

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { reconstructData } from '@/utils/dropdowndata-reconstruction';

export async function GET(request) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'CJ.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const corruptedData = JSON.parse(fileContent);

    // 재구성된 데이터 얻기
    const fixedData = reconstructData(corruptedData);

    // 결과 반환
    return NextResponse.json(fixedData);
  } catch (error) {
    console.error('Error processing data:', error);
    return NextResponse.json(
      { error: 'Failed to process data' },
      { status: 500 }
    );
  }
}
