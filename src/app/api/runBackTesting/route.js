import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
  try {
    const {
      startDate,
      endDate,
      rebalancePeriod,
      method,
      rsiPeriod,
      startMoney,
      assets,
    } = await request.json();

    return new Promise((resolve, reject) => {
      const pythonPath = '/home/ubuntu-server/superfantastic/bin/python';
      const scriptPath = path.resolve('/home/ubuntu-server/portfolio.py');

      // 각 인자를 `"data"` 형식으로 전달
      const pythonProcess = spawn(pythonPath, [
        scriptPath,
        '--assets', assets,
        '--rebal_period', rebalancePeriod,
        '--method', method,
        '--uninvested_asset', "현금",
        '--start_date', startDate,
        '--end_date', endDate,
      ]);

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
            const jsonData = JSON.parse(output);
						console.log(jsonData);
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
