import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { isValidGraphData } from '@/utils/graph-reconstruction';

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
        if (code === 0) {
          console.log('output', output);

          if (output.trim().startsWith('{') && output.trim().endsWith('}')) {
            try {
              const jsonData = JSON.parse(output);

              if (!isValidGraphData(jsonData)) {
                return resolve(
                  NextResponse.json(
                    { error: 'Invalid data format returned from Python script.' },
                    { status: 400 }
                  )
                );
              }

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
            // JSON이 아니면 단순 텍스트 응답
            resolve(NextResponse.json({ message: output.trim() }));
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
