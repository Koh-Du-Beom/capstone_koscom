"use client";
import { useState } from "react";
import FinancialReportTable from "@/components/tables/FinancialReportTable"; // 테이블 컴포넌트
import styles from './page.module.css'; // CSS 모듈 임포트

export default function BackTestingPage() {
  const [startDate, setStartDate] = useState('2013-01');
  const [endDate, setEndDate] = useState('2020-12');
  const [testAmount, setTestAmount] = useState(2500000);
  const [assets, setAssets] = useState([
    { name: '삼성전자', code: '005930', ratio: 70 },
    { name: 'SK하이닉스', code: '000660', ratio: 30 },
  ]);
  const [totalRatio, setTotalRatio] = useState(100); // 비율의 합
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
    setAssets([...assets, { name: '', code: '', ratio: 0 }]);
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

  const graphData = {
    labels: ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'],
    datasets: [
      {
        label: '내 포트폴리오',
        data: [2500000, 2800000, 3100000, 3200000, 3300000, 3500000, 3600000, 3469000],
        borderColor: 'blue',
        fill: false,
      },
      {
        label: 'KOSPI',
        data: [2500000, 2600000, 2400000, 2500000, 2600000, 2700000, 2800000, 3100000],
        borderColor: 'purple',
        fill: false,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>백테스트</h1>

      <div className={styles.content}>
        {/* 왼쪽: 포트폴리오 구성 */}
        <div className={styles.portfolioSection}>
          <h2>포트폴리오 구성</h2>
          <div className={styles.testPeriod}>
            <label>테스트 기간</label>
            <input 
              type="month" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className={styles.inputMonth}
            />
            <input 
              type="month" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className={styles.inputMonth}
            />
          </div>
          <div className={styles.testAmount}>
            <label>테스트 금액</label>
            <input 
              type="number" 
              value={testAmount} 
              onChange={(e) => setTestAmount(e.target.value)} 
              className={styles.inputAmount}
            />
          </div>
          <div className={styles.assetSection}>
            <label>테스트 자산</label>
            {assets.map((asset, index) => (
              <div key={index} className={styles.assetRow}>
                <input 
                  type="text" 
                  placeholder="종목 검색" 
                  value={asset.name} 
                  onChange={(e) => handleAssetChange(index, 'name', e.target.value)}
                  className={styles.inputStock}
                />
                <button onClick={openModal} className={styles.searchButton}>검색</button>
                <input 
                  type="number" 
                  value={asset.ratio} 
                  onChange={(e) => handleAssetChange(index, 'ratio', e.target.value)} 
                  className={styles.inputRatio}
                />
                <button onClick={() => handleRemoveAsset(index)} className={styles.removeButton}>X</button>
              </div>
            ))}
            <button onClick={handleAddAsset} className={styles.addButton}>+</button>
            <div className={styles.ratioSummary}>
              비율 합계: {totalRatio}%
            </div>
          </div>
          <button onClick={handleTestResult} className={styles.confirmButton}>결과 확인</button>
          <button className={styles.saveButton}>포트폴리오 저장</button>
        </div>

        {/* 오른쪽: 그래프와 요약 보고서 */}
        <div className={styles.resultSection}>
            <FinancialReportTable />
        </div>
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>종목 검색</h3>
            <p>여기에 종목 검색 기능 구현</p>
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
