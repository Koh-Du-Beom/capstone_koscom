import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(request) {
  try {
    const { message } = await request.json(); // Input message from frontend

    return new Promise((resolve, reject) => {
      // Python 실행 명령어 및 인자 설정
      const pythonProcess = spawn('python3', ['./python/gptapicall.py', '--string', message]);

      let output = '';
      let error = '';

      // stdout의 'data' 이벤트 리스너로 실행 결과를 받아옵니다.
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      // stderr의 'data' 이벤트 리스너로 에러 메시지를 받아옵니다.
      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      // Python 프로세스 종료 시, 결과를 반환합니다.
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const jsonData = JSON.parse(output); // Python 결과를 JSON으로 파싱
            resolve(NextResponse.json(jsonData)); // JSON 응답 반환
          } catch (parseError) {
            reject(NextResponse.json({ error: 'Failed to parse JSON output from Python script' }, { status: 500 }));
          }
        } else {
          reject(NextResponse.json({ error: `Python script exited with code ${code}: ${error}` }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    console.error('Error in getGraphData-prompt API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
