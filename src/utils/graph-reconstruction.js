export function isValidGraphData(data) {
  if (typeof data !== 'object' || Array.isArray(data)) return false;

  for (const [key, value] of Object.entries(data)) {
    if (typeof key !== 'string') return false; // Key는 문자열이어야 함
    if (typeof value !== 'object' || Array.isArray(value)) return false; // Value는 객체여야 함

    for (const [company, companyData] of Object.entries(value)) {
      if (typeof company !== 'string') return false; // 회사 이름은 문자열이어야 함
      if (typeof companyData !== 'object' || Array.isArray(companyData)) return false; // 회사 데이터는 객체여야 함

      for (const [date, metricValue] of Object.entries(companyData)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false; // 날짜 형식 검증 (YYYY-MM-DD)
        if (metricValue !== null && typeof metricValue !== 'number') return false; // 값은 null 또는 숫자여야 함
      }
    }
  }

  return true;
}
