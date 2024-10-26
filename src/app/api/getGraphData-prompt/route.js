import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
  try {
    const { message } = await request.json();

    // message가 문자열인지 확인
    if (typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: "message" must be a string.' },
        { status: 400 }
      );
    }

    return new Promise((resolve, reject) => {
      const pythonPath = '/home/ubuntu-server/superfantastic/bin/python';
      const scriptPath = path.resolve('/home/ubuntu-server/gptapicall.py'); // 새로운 경로로 수정

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
        if (code === 0) {
          console.log('output', output);
          try {
            // output을 배열로 파싱합니다.
            const jsonData = JSON.parse(output);
            if (!Array.isArray(jsonData)) {
              resolve(NextResponse.json([jsonData])); // 객체일 경우 배열로 감싸서 반환
            } else {
              resolve(NextResponse.json(jsonData)); // 이미 배열일 경우 그대로 반환
            }
          } catch (parseError) {
            console.error('JSON 파싱 오류:', parseError.message);
            reject(
              NextResponse.json(
                { error: 'Failed to parse JSON output from Python script' },
                { status: 500 }
              )
            );
          }
        } else {
          console.error(`Python script error: ${error}`);
          reject(
            NextResponse.json(
              { error: `Python script exited with code ${code}: ${error}` },
              { status: 501 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error('Error in getGraphData-prompt API route:', error);
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
