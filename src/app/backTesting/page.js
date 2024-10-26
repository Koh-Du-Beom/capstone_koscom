// src/app/backTesting/page.js

'use client';

import React, { useState, useEffect } from 'react';
import classes from './page.module.css';
import FinancialReportTable from '@/components/tables/FinancialReportTable';
import FinancialReportTableGraph from '@/components/graphs/FinancialReportTableGraph';
import SimpleStockListModal from '@/components/modal/simple-stock-list-modal/simple-stock-list-modal'; // 종목 검색 모달

export default function BackTestingPage() {
  // 백테스트 설정 및 입력값을 위한 상태 변수들
  const [startDate, setStartDate] = useState('2013-01'); // 테스트 시작일
  const [endDate, setEndDate] = useState('2020-12'); // 테스트 종료일
  const [rebalancePeriod, setRebalancePeriod] = useState('1일'); // 리밸런싱 주기
  const [method, setMethod] = useState('지정 비중'); // 리밸런싱 방법
  const [rsiPeriod, setRsiPeriod] = useState(14); // RSI 기간, 절대 모멘텀 방식 선택 시 활성화
  const [startMoney, setStartMoney] = useState(''); // 시작 금액
  const [assets, setAssets] = useState([]); // 테스트 자산 및 비율 저장
  const [totalRatio, setTotalRatio] = useState(0); // 자산 비율의 총합
  const [showModal, setShowModal] = useState(false); // 모달창 열림/닫힘
  const [isFormValid, setIsFormValid] = useState(false); // 포트폴리오 비율이 100%일 때만 활성화
  const [chartData, setChartData] = useState(null); // 차트 데이터
  const [tableData, setTableData] = useState(null); // 테이블 데이터

  const PORTFOLIO_STORAGE_KEY = 'savedPortfolioData'; // 로컬스토리지 키 설정

  // 포트폴리오 저장 함수 - 로컬 스토리지에 포트폴리오 데이터 저장
  const handleSavePortfolio = () => {
    const portfolioData = {
      startDate,
      endDate,
      rebalancePeriod,
      method,
      rsiPeriod,
      startMoney,
      assets,
    };
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolioData));
    alert('포트폴리오가 저장되었습니다.');
  };

  // 포트폴리오 불러오기 함수 - 로컬 스토리지에서 저장된 포트폴리오 설정 불러오기
  const handleLoadPortfolio = () => {
    const savedData = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (savedData) {
      const { startDate, endDate, rebalancePeriod, method, rsiPeriod, startMoney, assets } = JSON.parse(savedData);
      setStartDate(startDate);
      setEndDate(endDate);
      setRebalancePeriod(rebalancePeriod);
      setMethod(method);
      setRsiPeriod(rsiPeriod);
      setStartMoney(startMoney);
      setAssets(assets);
      setTotalRatio(assets.reduce((sum, asset) => sum + asset.ratio, 0)); // 비율 합계 계산하여 상태 업데이트
    } else {
      alert('저장된 포트폴리오가 없습니다.');
    }
  };

  // 리밸런싱 방법 선택에 따라 RSI 입력칸 활성화 여부 결정
  const handleMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setMethod(selectedMethod);
  };

  const isRsiDisabled = method !== '절대 모멘텀'; // 절대 모멘텀이 아닌 경우 RSI 비활성화

  // 자산 비율의 총합 계산 함수
  const calculateTotalRatio = (assets) => {
    return assets.reduce((sum, asset) => sum + Number(asset.ratio), 0);
  };

  // 자산 비율 변경 함수 - 자산별 비율이 0~100% 범위 내에서만 변경 가능
  const handleAssetChange = (index, field, value) => {
    if (value >= 0 && value <= 100) {
      const updatedAssets = [...assets];
      updatedAssets[index][field] = value === '' ? 0 : Number(value);
      setAssets(updatedAssets);
      setTotalRatio(calculateTotalRatio(updatedAssets));
    }
  };

  // 모달 열기 및 닫기 함수
  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  // 모달에서 선택된 종목을 자산 목록에 추가
  const handleSelectStock = (selectedStock) => {
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

  // 총 비율이 100%인지 확인하여 버튼 활성화 여부 결정
  useEffect(() => {
    setIsFormValid(totalRatio === 100);
  }, [totalRatio]);

  // 시작 금액 - 세 자릿수마다 콤마 추가 함수
  const formatMoney = (value) => {
    const number = parseInt(value.replace(/,/g, '')); // 기존 콤마 제거 후 숫자로 변환
    if (isNaN(number)) return ''; // 숫자가 아닐 경우 빈 문자열
    return number.toLocaleString(); // 세 자리마다 콤마 추가
  };

  // 입력값 처리 함수
  const handleMoneyChange = (value) => {
    setStartMoney(formatMoney(value)); // 포맷팅된 값을 상태에 저장
  };

  // 백엔드로 포트폴리오 구성 데이터를 전송하는 함수
  const sendPortfolioDataToBackend = async () => {
    try {
      await fetch('/api/backtest/portfolioData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate, rebalancePeriod, method, startMoney, assets })
      });
      console.log('포트폴리오 데이터가 백엔드로 전송되었습니다.');
    } catch (error) {
      console.error('백엔드로 데이터 전송 중 오류:', error);
    }
  };

  // 차트 데이터를 백엔드에서 가져오는 함수
  const fetchChartData = async () => {
    try {
      const response = await fetch('/api/backtest/chartData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate, rebalancePeriod, method, startMoney, assets })
      });
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error('차트 데이터 로드 중 오류:', error);
    }
  };

  // 테이블 데이터를 백엔드에서 가져오는 함수
  const fetchTableData = async () => {
    try {
      const response = await fetch('/api/backtest/tableData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate, rebalancePeriod, method, startMoney, assets })
      });
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error('표 데이터 로드 중 오류:', error);
    }
  };

  // 백테스트 실행 함수 - 포트폴리오 데이터 전송 후 차트와 테이블 데이터를 각각 가져옴
  const handleRunBacktest = () => {
    sendPortfolioDataToBackend();
    fetchChartData();
    fetchTableData();
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>백테스트</h1>

      <div className={classes.content}>
        {/* 좌측: 포트폴리오 구성 */}
        <div className={classes.portfolioSection}>
          <div className={classes.sectionHeader}>
            <h2 className={classes.sectionTitle}>포트폴리오 구성</h2>
            <button className={classes.loadButton} onClick={handleLoadPortfolio}>불러오기</button>
          </div>

          {/* 테스트 기간 입력 */}
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

          {/* 리밸런싱 주기 드롭다운 */}
          <div className={classes.dropdownContainer}>
            <label className={classes.label}>리밸런싱 주기</label>
            <div className={classes.dropdownHeader}>
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
          </div>

          {/* 리밸런싱 방법 드롭다운 */}
          <div className={classes.dropdownContainer}>
            <label className={classes.label}>리밸런싱 방법</label>
            <div className={classes.dropdownHeader}>
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
          </div>

          {/* RSI 기간 입력 */}
          <div className={classes.formGroup}>
            <label className={classes.label}>RSI 기간</label>
            <input
              type="number"
              value={rsiPeriod}
              onChange={(e) => setRsiPeriod(e.target.value)}
              className={classes.input}
              disabled={isRsiDisabled}
            />
          </div>

          {/* 시작 자금 입력 */}
          <div className={classes.formGroup}>
            <label className={classes.label}>시작 금액</label>
            <div className={classes.moneyInputContainer}>
              <span className={classes.moneySymbol}>₩</span>
              <input
                type="text" // 숫자형 대신 text로 사용
                value={startMoney}
                onChange={(e) => handleMoneyChange(e.target.value)}
                className={classes.moneyInput}
                placeholder="0"
              />
            </div>
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

          {/* 실행 및 저장 버튼 */}
          <div className={classes.buttonGroup}>
            <button className={classes.confirmButton} onClick={handleRunBacktest} disabled={!isFormValid}>
              결과 확인
            </button>
            <button className={classes.saveButton} onClick={handleSavePortfolio} disabled={!isFormValid}>포트폴리오 저장</button>
          </div>
        </div>

        {/* 우측: 그래프 및 요약 보고서 */}
        <div className={classes.resultSection}>
          <div className={classes.graphSection}>
            {chartData && <FinancialReportTableGraph chartData={chartData} />}
          </div>
          <div className={classes.tableSection}>
            {tableData && <FinancialReportTable tableData={tableData} />}
          </div>
        </div>
      </div>

      {/* 종목 검색 모달 창 */}
      {showModal && (
        <SimpleStockListModal onClose={toggleModal} onAddItem={handleSelectStock} />
      )}
    </div>
  );
}
