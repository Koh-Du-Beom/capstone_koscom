import Papa from 'papaparse';

export const parseCSV = async (filePath) => {
  const response = await fetch(filePath);
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let csvData = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    csvData += decoder.decode(value);
  }
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true, // CSV 첫 줄을 헤더로 처리
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};
