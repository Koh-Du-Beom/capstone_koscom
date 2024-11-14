// 올바른 키 목록
export const correctKeys = [
  "periodEndDate",
  "총 매출",
  "총 매출원가",
  "매출총이익",
  "총 판매관리비",
  "연구개발비",
  "무형자산 및 기타 상각비",
  "감가상각비 & 감모상각비",
  "영업이익",
  "비영업관련 순 이자수익(비용)",
  "자산매각이익(손실)",
  "기타 이익(비용)",
  "세전당기순이익",
  "법인세",
  "세후당기순이익",
  "비지배지분 귀속 당기순이익",
  "순이익",
  "주당순이익",
  "희석된가중평균유통주식수",
  "매출총이익률",
  "영업이익률",
  "세전순이익률",
  "순이익률",
  "감가상각전영업이익",
  "EBITDA이익률",
  "총이자보상배율",
  "총이자보상배율(EBITDA)",
  "총 외상매출금",
  "재고자산",
  "선급비용",
  "총 기타 유동자산",
  "현금 및 단기투자자산",
  "유동자산 총계",
  "유형자산 순액",
  "무형자산 순액",
  "장기투자자산",
  "장기받을어음",
  "총 기타 장기자산",
  "비유동자산 총계",
  "자산 총계",
  "매입채무",
  "미지급 비용",
  "발행어음 & 단기차입금",
  "유동성 장기부채 & 금융리스",
  "총 기타 유동부채",
  "유동부채 총계",
  "총 장기차입금",
  "이연법인세",
  "총 기타 부채",
  "비유동부채 총계",
  "부채총계",
  "총 보통주",
  "주식발행초과금",
  "이익잉여금(누적적자)",
  "자기주식 - 보통주",
  "미실현 이익(손실)",
  "총 기타 자본",
  "유통보통주식수",
  "자본총계",
  "유형자기자본",
  "주당유형자기자본",
  "비지배지분",
  "순차입금",
  "비현금 항목",
  "감가상각비",
  "운전자본 증감",
  "영업활동현금흐름",
  "자본적지출",
  "기타 투자활동현금흐름 항목",
  "차입금 조달액(상환액)",
  "기타 재무활동현금흐름 항목",
  "재무활동현금흐름",
  "환율변동효과",
  "현금 증감",
  "기초 현금",
  "기말 현금",
  "현금이자지급액",
  "현금세금지급액",
  "잉여현금흐름",
  "주당잉여현금흐름",
  "주당배당금"
];


// 값 추출 함수
export function extractValuesFromCorruptedData(corruptedEntry) {
  // 'periodEndDate'는 이미 정상적이므로 먼저 추가
  const values = [corruptedEntry['periodEndDate']];

  // 'periodEndDate'를 제외한 나머지 키들을 원래 순서대로 정렬
  const keysExcludingPeriodEndDate = Object.keys(corruptedEntry).filter(key => key !== 'periodEndDate');

  // 깨진 키들을 원래 입력된 순서대로 유지하려면, Object.values를 사용
  const valuesExcludingPeriodEndDate = keysExcludingPeriodEndDate.map(key => corruptedEntry[key]);

  // 전체 값 배열 생성
  const allValues = values.concat(valuesExcludingPeriodEndDate);

  return allValues;
}

// 키와 값을 매핑하여 새로운 객체 생성
export function reconstructEntry(correctKeys, values) {
  const reconstructedEntry = {};
  for (let i = 0; i < correctKeys.length; i++) {
    reconstructedEntry[correctKeys[i]] = values[i];
  }
  return reconstructedEntry;
}

// 전체 데이터를 처리하여 새로운 데이터 생성
export function reconstructData(corruptedData) {
  const reconstructedData = {};

  for (const [dateKey, corruptedEntry] of Object.entries(corruptedData)) {
    const values = extractValuesFromCorruptedData(corruptedEntry);
    const reconstructedEntry = reconstructEntry(correctKeys, values);
    reconstructedData[dateKey] = reconstructedEntry;
  }

  return reconstructedData;
}
