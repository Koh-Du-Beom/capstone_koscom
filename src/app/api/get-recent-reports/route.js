import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
  try {
    // 클라이언트에서 전달된 stockcode 파라미터 추출
    const { stockcode } = await request.json();

    return new Promise((resolve, reject) => {
      const pythonPath = '/home/ubuntu-server/superfantastic/bin/python';
      const scriptPath = path.resolve('/home/ubuntu-server/report.py');

      // 파이썬 스크립트를 호출할 때 stockcode를 인자로 전달
      const pythonProcess = spawn(pythonPath, [scriptPath, '--stockcode', stockcode]);

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
          try {
            console.log("Python Script Output:", output);
            const jsonData = JSON.parse(output); // JSON 형식으로 변환
            resolve(NextResponse.json(jsonData));
          } catch (parseError) {
            console.error("JSON Parsing Error:", output);
            reject(
              NextResponse.json({ error: 'Failed to parse JSON output from Python script' }, { status: 500 })
            );
          }
        } else {
          console.error("Python Error Output:", error);
          reject(
            NextResponse.json({ error: `Python script exited with code ${code}: ${error}` }, { status: 501 })
          );
        }
      });
    });
  } catch (error) {
    console.error("Request Handling Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
