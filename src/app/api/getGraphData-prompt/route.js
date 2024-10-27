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

          // output이 JSON 형식인지 문자열인지 구분
          if (output.trim().startsWith('{') && output.trim().endsWith('}')) {
            try {
              const jsonData = JSON.parse(output);
              resolve(NextResponse.json(Array.isArray(jsonData) ? jsonData : [jsonData]));
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
            // JSON 형식이 아닌 경우 문자열로 반환
            resolve(NextResponse.json(output.trim()));
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
