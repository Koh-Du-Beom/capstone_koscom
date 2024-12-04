import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

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
    const { stockCode } = await request.json();

    if (typeof stockCode !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: "stockCode" must be a string.' },
        { status: 400 }
      );
    }

    return new Promise((resolve, reject) => {
      const pythonPath = '/home/ubuntu-server/superfantastic/bin/python'; // Python 실행 경로
      const scriptPath = path.resolve('/home/ubuntu-server/stock_graph.py'); // Python 스크립트 경로

      // Python 프로세스 실행
      const pythonProcess = spawn(pythonPath, [scriptPath, '--stockCode', stockCode]);
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

        const jsonData = parseJSON(output.trim());
        if (jsonData) {
          return resolve(NextResponse.json(jsonData));
        }

        resolve(NextResponse.json({ message: output.trim() }));
      });
    });
  } catch (error) {
    console.error('Error in mini-stockGraph API route:', error.message);
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
