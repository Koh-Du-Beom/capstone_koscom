// parseCSV2.js
import Papa from 'papaparse';

export const parseCSV2 = async (filePath) => {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true, // URL에서 CSV 파일을 직접 다운로드
      header: true,   // 첫 줄을 헤더로 사용
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};
