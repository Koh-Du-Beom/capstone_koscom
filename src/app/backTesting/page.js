'use client';

import React, { useState, useEffect } from 'react';
import classes from './page.module.css';
import StockListModal from '@/components/stock-list-modal/stock-list-modal'; // 종목 선택 모달

export default function BackTestingPage() {
  const [startDate, setStartDate] = useState('2013-01'); // 테스트 기간의 시작 날짜
  const [endDate, setEndDate] = useState('2020-12'); // 테스트 기간의 종료 날짜
  const [rebalancePeriod, setRebalancePeriod] = useState('1일'); // 리밸런싱 주기
  const [method, setMethod] = useState('지정 비중'); // 리밸런싱 방법
  const [rsiPeriod, setRsiPeriod] = useState(14); // RSI 기간, 절대 모멘텀 방식 선택 시 활성화
  const [assets, setAssets] = useState([]); // 테스트 자산 목록 및 비율 저장
  const [totalRatio, setTotalRatio] = useState(0); // 자산 비율의 총합
  const [showModal, setShowModal] = useState(false); // 모달창 상태 열림/닫힘
  const [isFormValid, setIsFormValid] = useState(false); // 비율 합이 100%인지 여부

  // 리밸런싱 방법 선택에 따라 RSI 입력칸 활성화 여부 결정
  const handleMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setMethod(selectedMethod);
  };

  const isRsiDisabled = method !== '절대 모멘텀'; // 절대 모멘텀이 아니면 RSI 비활성화

  // 비율의 합을 계산하는 함수
  const calculateTotalRatio = (assets) => {
    return assets.reduce((sum, asset) => sum + Number(asset.ratio), 0);
  };

  // 각 자산의 비율을 변경하는 함수
  const handleAssetChange = (index, field, value) => {
    if (value >= 0 && value <= 100) {  // 0~100 사이의 값으로 제한
      const updatedAssets = [...assets];
      updatedAssets[index][field] = value === '' ? 0 : Number(value); // 빈 값이면 0으로 처리
      setAssets(updatedAssets);
      setTotalRatio(calculateTotalRatio(updatedAssets));
    }
  };

  // 모달을 열고 닫는 함수
  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  // 모달에서 선택된 종목을 자산 목록에 추가하는 함수
  const handleSelectStock = (selectedStock) => {
    // 중복 방지
    const isAlreadySelected = assets.some((asset) => asset.code === selectedStock.code);
    if (!isAlreadySelected) {
      const updatedAssets = [...assets];
      updatedAssets.push({ name: selectedStock.name, code: selectedStock.code, ratio: 0 });
      setAssets(updatedAssets);
      setTotalRatio(calculateTotalRatio(updatedAssets));
    }
    toggleModal(); // 모달 닫기
  };

  // 자산 목록에서 종목을 삭제하는 함수
  const handleRemoveAsset = (index) => {
    const updatedAssets = assets.filter((_, i) => i !== index);
    setAssets(updatedAssets);
    setTotalRatio(calculateTotalRatio(updatedAssets));
  };

  // 비율 합이 100%인지 확인하여 버튼 활성화/비활성화
  useEffect(() => {
    setIsFormValid(totalRatio === 100);
  }, [totalRatio]);

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>백테스트</h1>

      <div className={classes.content}>
        {/* 왼쪽: 포트폴리오 구성 */}
        <div className={classes.portfolioSection}>
          <div className={classes.sectionHeader}>
            <h2 className={classes.sectionTitle}>포트폴리오 구성</h2>
            <button className={classes.loadButton}>불러오기</button>
          </div>

          {/* 테스트 기간 항목 */}
          <div className={classes.formGroup}>
            <label className={classes.label}>테스트 기간</label>
            <div className={classes.dateInputs}>
              <div>
                <label className={classes.subLabel}>시작일</label>
                <input 
                  type="month" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  className={classes.input}
                />
              </div>
              <div>
                <label className={classes.subLabel}>종료일</label>
                <input 
                  type="month" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  className={classes.input}
                />
              </div>
            </div>
          </div>

          {/* 리밸런싱 주기 항목 */}
          <div className={classes.formGroup}>
            <label className={classes.label}>리밸런싱 주기</label>
            <select
              value={rebalancePeriod}
              onChange={(e) => setRebalancePeriod(e.target.value)}
              className={classes.select}
            >
              <option value="1일">1일</option>
              <option value="1주일">1주일</option>
              <option value="1달">1달</option>
            </select>
          </div>

          {/* 리밸런싱 방법 항목 */}
          <div className={classes.formGroup}>
            <label className={classes.label}>방법</label>
            <select
              value={method}
              onChange={handleMethodChange}
              className={classes.select}
            >
              <option value="지정 비중">지정 비중</option>
              <option value="동일 비중">동일 비중</option>
              <option value="절대 모멘텀">절대 모멘텀</option>
              <option value="최소 분산">최소 분산</option>
              <option value="최대 다각화">최대 다각화</option>
            </select>
          </div>

          {/* RSI 기간 입력칸 (절대 모멘텀 선택 시만 활성화) */}
          <div className={classes.formGroup}>
            <label className={classes.label}>RSI 기간</label>
            <input
              type="number"
              value={rsiPeriod}
              onChange={(e) => setRsiPeriod(e.target.value)}
              className={classes.input}
              disabled={isRsiDisabled} // 절대 모멘텀이 아니면 비활성화
            />
          </div>

          {/* 테스트 자산 입력 */}
          <div className={classes.formGroup}>
            <div className={classes.assetHeader}>
              <h2 className={classes.label}>테스트 자산</h2>
              <button className={classes.loadButton} onClick={toggleModal}>종목 추가</button>
            </div>
            {assets.map((asset, index) => (
              <div key={index} className={classes.assetRow}>
                <div className={classes.assetInfo}>
                  <span>{asset.name} ({asset.code})</span>
                </div>
                <div className={classes.assetRatio}>
                  <input 
                    type="number" 
                    value={asset.ratio} 
                    onChange={(e) => handleAssetChange(index, 'ratio', e.target.value)} 
                    className={classes.inputRatio}
                  />
                  <span className={classes.ratioText}>%</span>
                  <button onClick={() => handleRemoveAsset(index)} className={classes.removeButton}>✖</button>
                </div>
              </div>
            ))}
            <div className={classes.ratioSummary}>
              비율 합계: {totalRatio}%
            </div>
          </div>

          <div className={classes.buttonGroup}>
            <button className={classes.confirmButton} disabled={!isFormValid}>결과 확인</button>
            <button className={classes.saveButton} disabled={!isFormValid}>포트폴리오 저장</button>
          </div>
        </div>

        {/* 오른쪽: 그래프와 요약 보고서 */}
        <div className={classes.resultSection}>
          {/* FinancialReportTable 컴포넌트와 그래프 */}
          <div className={classes.graphSection}>
            {/* 예시 그래프 섹션 */}
            {/* 결과가 이곳에 들어가야 합니다 */}
          </div>
        </div>
      </div>

      {/* 종목 검색 모달 창 */}
      {showModal && (
        <StockListModal onClose={toggleModal} onAddItem={handleSelectStock} />
      )}
    </div>
  );
}
