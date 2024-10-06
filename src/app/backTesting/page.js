"use client";
import { useState } from "react";
import FinancialReportTable from "@/components/tables/FinancialReportTable"; // 테이블 컴포넌트
import StockSearchModal from "@/components/modal/StockSearchModal"; // 모달 컴포넌트 경로 수정
import styles from './page.module.css'; // CSS 모듈 임포트

export default function BackTestingPage() {
  const [startDate, setStartDate] = useState('2013-01');
  const [endDate, setEndDate] = useState('2020-12');
  const [testAmount, setTestAmount] = useState(0); // 기본값 0으로 수정
  const [assets, setAssets] = useState([
    { name: '삼성전자', code: '005930', ratio: 0 }, // 기본 비율 0으로 수정
    { name: 'SK하이닉스', code: '000660', ratio: 0 },
  ]);
  const [totalRatio, setTotalRatio] = useState(0); // 비율의 합
  const [showModal, setShowModal] = useState(false); // 모달 창 상태

  const handleAssetChange = (index, field, value) => {
    const updatedAssets = [...assets];
    updatedAssets[index][field] = value;
    setAssets(updatedAssets);

    // 비율의 합 계산
    const newTotalRatio = updatedAssets.reduce((sum, asset) => sum + Number(asset.ratio), 0);
    setTotalRatio(newTotalRatio);
  };

  const handleAddAsset = () => {
    openModal(); // 종목 검색 모달 열기
  };

  const handleRemoveAsset = (index) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleTestResult = () => {
    console.log('백테스트 결과 확인');
  };

  const handleSelectStock = (selectedStock) => {
    // 모달에서 선택된 종목을 처리하는 함수
    const updatedAssets = [...assets];
    updatedAssets.push({ name: selectedStock.name, code: selectedStock.code, ratio: 0 });
    setAssets(updatedAssets);
    closeModal();
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/,/g, ""); // 숫자 포맷에서 ',' 제거
    if (!isNaN(value)) {
      setTestAmount(Number(value));
    }
  };

  const formatAmount = (value) => {
    return value.toLocaleString('ko-KR'); // 세 자리마다 콤마
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>백테스트</h1>

      <div className={styles.content}>
        {/* 왼쪽: 포트폴리오 구성 */}
        <div className={styles.portfolioSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>포트폴리오 구성</h2>
            <button className={styles.loadButton}>불러오기</button>
          </div>

          {/* 테스트 기간 항목 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>테스트 기간</label>
            <div className={styles.dateInputs}>
              <div>
                <label className={styles.subLabel}>시작일</label>
                <input 
                  type="month" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.subLabel}>종료일</label>
                <input 
                  type="month" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* 테스트 금액 항목 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>테스트 금액</label>
            <div className={styles.amountInputWrapper}>
              <span className={styles.currencySymbol}>₩</span>
              <input
                type="text"
                value={formatAmount(testAmount)}
                onChange={handleAmountChange}
                className={styles.inputWithSymbol}
              />
            </div>
          </div>

          {/* 테스트 자산 항목 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>테스트 자산</label>
            <div className={styles.assetRow}>
              <span className={styles.assetHeader}>종목</span>
              <span className={styles.assetHeader}>비율</span>
            </div>
            {assets.map((asset, index) => (
              <div key={index} className={styles.assetRow}>
                <div className={styles.assetInfo}>
                  <span>{asset.name}</span>
                </div>
                <div className={styles.assetRatio}>
                  <input 
                    type="number" 
                    value={asset.ratio} 
                    onChange={(e) => handleAssetChange(index, 'ratio', e.target.value)} 
                    className={styles.inputRatio}
                  />
                  <span>%</span>
                  <button onClick={() => handleRemoveAsset(index)} className={styles.removeButton}>✖</button>
                </div>
              </div>
            ))}
            <button onClick={handleAddAsset} className={styles.addButton}>+</button>
            <div className={styles.ratioSummary}>
              비율 합계: {totalRatio}%
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button onClick={handleTestResult} className={styles.confirmButton}>결과 확인</button>
            <button className={styles.saveButton}>포트폴리오 저장</button>
          </div>
        </div>

        {/* 오른쪽: 그래프와 요약 보고서 그대로 유지 */}
        <div className={styles.resultSection}>
            <FinancialReportTable />
        </div>
      </div>

      {/* 종목 검색 모달 창 컴포넌트 경로 수정 */}
      {showModal && (
        <StockSearchModal closeModal={closeModal} handleSelectStock={handleSelectStock} />
      )}
    </div>
  );
}
