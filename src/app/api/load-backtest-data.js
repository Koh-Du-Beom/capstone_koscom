// pages/api/load-backtest-data.js

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

// API 핸들러
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // JSON 데이터 파일 경로와 CSV 파일 경로 설정
  const jsonDataFilePath = path.resolve('public', 'csv', 'backtestMockData.txt');
  const outputCsvPath = path.resolve('public', 'csv');

  // JSON 데이터에서 CSV 파일 생성 및 다시 JSON으로 변환하는 함수
  async function convertJsonToCsvAndBack(jsonDataFilePath, outputCsvPath) {
    const jsonData = JSON.parse(fs.readFileSync(jsonDataFilePath, 'utf8'));

    // portfolio_returns와 holdings_proportions 분리
    const { portfolio_returns, holdings_proportions } = jsonData;

    // CSV 파일로 저장
    const portfolioCsvRows = [
      ['dates', 'returns'],
      ...portfolio_returns.dates.map((date, idx) => [date, portfolio_returns.returns[idx]]),
    ];

    const holdingsCsvRows = [
      ['date', ...Object.keys(holdings_proportions[0]).filter((key) => key !== 'date')],
      ...holdings_proportions.map((row) =>
        [row.date, ...Object.values(row).filter((_, idx) => idx > 0)]
      ),
    ];

    // CSV 파일 쓰기
    fs.writeFileSync(
      path.resolve(outputCsvPath, 'portfolio_returns.csv'),
      portfolioCsvRows.map((row) => row.join(',')).join('\n')
    );

    fs.writeFileSync(
      path.resolve(outputCsvPath, 'holdings_proportions.csv'),
      holdingsCsvRows.map((row) => row.join(',')).join('\n')
    );

    // CSV 파일을 다시 JSON 객체로 변환
    const resultJson = {
      portfolio_returns: [],
      holdings_proportions: [],
    };

    function parseCsvToJson(csvPath, targetArray) {
      return new Promise((resolve) => {
        fs.createReadStream(csvPath)
          .pipe(csv())
          .on('data', (data) => targetArray.push(data))
          .on('end', resolve);
      });
    }

    await Promise.all([
      parseCsvToJson(path.resolve(outputCsvPath, 'portfolio_returns.csv'), resultJson.portfolio_returns),
      parseCsvToJson(path.resolve(outputCsvPath, 'holdings_proportions.csv'), resultJson.holdings_proportions),
    ]);

    return resultJson; // 그래프에 사용할 JSON 형태
  }

  try {
    // 데이터 변환 후 JSON 형태로 결과 반환
    const convertedData = await convertJsonToCsvAndBack(jsonDataFilePath, outputCsvPath);
    res.status(200).json(convertedData);
  } catch (error) {
    console.error('Error in converting data:', error);
    res.status(500).json({ message: 'Data conversion failed' });
  }
}
