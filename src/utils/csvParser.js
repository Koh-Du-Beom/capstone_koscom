// @/utils/csvParser.js

export const csvParser = (csv) => {
    const lines = csv.split("\n"); // 줄바꿈으로 구분하여 각 라인 분리
    const headers = lines[0].split(","); // 첫 번째 줄을 헤더로 설정
  
    const result = [];
  
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].trim();
  
      if (currentLine.length === 0) {
        continue; // 빈 줄 건너뛰기
      }
  
      const values = currentLine.split(",");
  
      // 각 헤더에 맞는 값을 매핑하여 객체로 변환
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
  
      result.push(obj); // 결과 배열에 추가
    }
  
    return result;
  };
  