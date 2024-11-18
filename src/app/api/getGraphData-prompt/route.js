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
      const pythonPath = '/home/ubuntu-server/superfantastic/bin/python';
      const scriptPath = path.resolve('/home/ubuntu-server/gptapicall.py');

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

        console.log('output:', output);

        const jsonData = parseJSON(output.trim());
        if (jsonData) {
          // JSON 데이터 처리
          if (!isValidGraphData(jsonData)) {
            return resolve(
              NextResponse.json(
                { error: 'Invalid data format returned from Python script.' },
                { status: 400 }
              )
            );
          }
          return resolve(NextResponse.json(Array.isArray(jsonData) ? jsonData : [jsonData]));
        }

        // 단순 문자열 응답 처리
        resolve(NextResponse.json({ message: output.trim() }));
      });
    });
  } catch (error) {
    console.error('Error in getGraphData-prompt API route:', error.message);
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
