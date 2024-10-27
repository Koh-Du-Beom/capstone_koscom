
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

    // Convert assets array to "종목코드,비율" format, separated by semicolons
    const formattedAssets = assets.map((asset) => `${asset.code},${asset.ratio}`).join(';');

    return new Promise((resolve, reject) => {
      const pythonPath = '/home/ubuntu-server/superfantastic/bin/python';
      const scriptPath = path.resolve('/home/ubuntu-server/portpolio.py');

      const pythonProcess = spawn(pythonPath, [
        scriptPath,
        '--assets', formattedAssets,
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
            resolve(NextResponse.json(jsonData));
          } catch (parseError) {
            reject(
              NextResponse.json({ error: 'Failed to parse JSON output from Python script' }, { status: 500 })
            );
          }
        } else {
          reject(
            NextResponse.json({ error: `Python script exited with code ${code}: ${error}` }, { status: 501 })
          );
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
