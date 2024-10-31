import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

function parseOutputToReports(output) {
  const lines = output.split('\n');
  const reports = [];
  let currentReport = {};
  let stockName = ''; // 종목명을 저장할 변수

  lines.forEach(line => {
    const [key, ...rest] = line.split(':');
    const value = rest.join(':').trim();

    if (key.includes('종목명')) {
      stockName = value; // 종목명을 저장
    } else if (key.includes('리포트 제목')) {
      if (Object.keys(currentReport).length > 0) {
        // 각 리포트에 stockName을 추가
        currentReport.stockName = stockName;
        reports.push(currentReport);
        currentReport = {};
      }
      currentReport.title = value;
    } else if (key.includes('발행 기관')) {
      currentReport.organization = value;
    } else if (key.includes('파일 링크')) {
      currentReport.fileLink = value;
    } else if (key.includes('날짜')) {
      currentReport.date = value;
    } else if (key.includes('목표가')) {
      currentReport.targetPrice = value;
    } else if (key.includes('투자의견')) {
      currentReport.opinion = value;
    }
  });

  // 마지막 리포트에 stockName을 추가하고 배열에 넣기
  if (Object.keys(currentReport).length > 0) {
    currentReport.stockName = stockName;
    reports.push(currentReport);
  }

  return reports;
}

export async function POST(request) {
  try {
    const { stockcode } = await request.json();

    return new Promise((resolve, reject) => {
      const pythonPath = '/home/ubuntu-server/superfantastic/bin/python';
      const scriptPath = path.resolve('/home/ubuntu-server/report.py');
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
          console.log("Type of output: ", typeof output);
          try {
            const jsonData = parseOutputToReports(output);
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
