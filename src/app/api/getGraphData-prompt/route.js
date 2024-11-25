import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { isValidGraphData } from '@/utils/graph-reconstruction';

// JSON 유효성 검증 함수
function parseJSON(data) {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: "message" must be a string.' },
        { status: 400 }
      );
    }

    return new Promise((resolve, reject) => {
      const pythonPath = '/home/ubuntu-server/superfantastic/bin/python'; // Python 실행 경로
      const scriptPath = path.resolve('/home/ubuntu-server/gptapicall.py'); // Python 스크립트 경로

      // Python 프로세스 실행
      const pythonProcess = spawn(pythonPath, [scriptPath, '--sentence', message]);
      let output = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python script error: ${error}`);
          return reject(
            NextResponse.json(
              { error: `Python script exited with code ${code}: ${error.trim()}` },
              { status: 501 }
            )
          );
        }

        console.log('output : ', output);

        const jsonData = parseJSON(output.trim());
        if (jsonData) {
          // 그래프 데이터인지 확인
          if (isValidGraphData(jsonData)) {
            return resolve(
              NextResponse.json(Array.isArray(jsonData) ? jsonData : [jsonData])
            );
          }
          // 그래프 데이터가 아니면 무시 (불필요한 JSON 제거)
          return resolve(NextResponse.json({ message: output.trim() }));
        }

        // JSON이 아닌 단순 문자열 데이터 처리
        resolve(NextResponse.json({ message: output.trim() }));
      });
    });
  } catch (error) {
    console.error('Error in getGraphData-prompt API route:', error.message);
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
