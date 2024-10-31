'use client'
import { useState } from "react";
import BackTestingDropdown from "@/components/back-testing/back-testing-methods/back-testing-dropdown";
import BackTestingPeriod from "@/components/back-testing/back-testing-period/back-testing-period";
import BackTestingAsset from "@/components/back-testing/back-testing-assets/back-testing-assets";
import { getLocalStorageItems, setLocalStorageItems } from "@/utils/localStorage";
import FinancialReportGraph from "@/components/graphs/financial-report-graph";
import classes from "./page.module.css";

import report_Mock_data from "@/components/graphs/financial-report-data";

const PORTFOLIO_STORAGE_KEY = 'savedPortfolioData';

export default function BacktestingPageTwo() {
  const [backTestingInfos, setBackTestingInfos] = useState({
    startDate: '',
    endDate: '',
    rebalancePeriod: '',
    method: '',
    rsiPeriod: '',
    startMoney: '',
    assets: '',
  });

  const [rsiError, setRsiError] = useState("");
  const [portfolioData, setPortfolioData] = useState(null);
  const [holdingsData, setHoldingsData] = useState(null);

  const updateBackTestingInfos = (key, value) => {
    setBackTestingInfos((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleMoneyChange = (event) => {
    const input = event.target.value.replace(/[^\d]/g, "");
    const formattedValue = input.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    updateBackTestingInfos("startMoney", formattedValue);
  };

  const handleRsiChange = (event) => {
    const value = event.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setRsiError("");
      updateBackTestingInfos("rsiPeriod", value);
    } else {
      setRsiError("숫자를 입력해주세요.");
    }
  };

  const handleSave = () => {
    setLocalStorageItems(PORTFOLIO_STORAGE_KEY, backTestingInfos);
    alert("설정이 저장되었습니다.");
  };

  const handleLoad = () => {
    const savedData = getLocalStorageItems(PORTFOLIO_STORAGE_KEY);
    if (savedData) {
      setBackTestingInfos(savedData);
      alert("저장된 설정이 불러와졌습니다.");
    } else {
      alert("저장된 설정이 없습니다.");
    }
  };

  // 백엔드 API에 요청을 보내는 함수
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/runBackTesting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backTestingInfos),
      });

      if (!response.ok) {
        throw new Error("데이터 요청에 실패했습니다.");
      }

      const data = await response.json();

      // 받은 데이터를 holdings와 portfolio로 나누어 상태 설정
      setPortfolioData(data.portfolio_returns); // portfolio 데이터 저장
      setHoldingsData(data.holdings_proportions[0]); // holdings 데이터 저장

      console.log("Portfolio Data:", data.portfolio_returns);
      console.log("Holdings Data:", data.holdings_proportions[0]);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("데이터 요청 중 문제가 발생했습니다.");
    }
  };

  //프론트엔드에서 그래프 표시 임시테스트
  const handleMockSubmit = (event) => {
    event.preventDefault();
    try {
      const data = report_Mock_data[0];
      setPortfolioData(data.portfolio_returns);
      setHoldingsData(data.holdings_proportions[0]);
      console.log("Mock Portfolio Data:", data.portfolio_returns);
      console.log("Mock Holdings Data:", data.holdings_proportions[0]);
    } catch (error) {
      console.error("Error parsing mock data:", error);
      alert("Mock 데이터 처리 중 문제가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classes.container}>
      <div className={classes.leftSection}>
        <div className={classes.buttonContainer}>
          <button type="button" onClick={handleSave} className={classes.saveButton}>저장</button>
          <button type="button" onClick={handleLoad} className={classes.loadButton}>불러오기</button>
        </div>
        
        <h6>시작일</h6>
        <BackTestingPeriod options="startDate" updateParentObject={updateBackTestingInfos} />
        <h6>종료일</h6>
        <BackTestingPeriod options="endDate" updateParentObject={updateBackTestingInfos} />
        
        <h6>리밸런싱 주기</h6>
        <BackTestingDropdown
          options={['1개월', '3개월', '6개월', '1년']}
          targetKey="rebalancePeriod"
          updateParentObject={updateBackTestingInfos}
        />

        <h6>리밸런싱 방법</h6>
        <BackTestingDropdown
          options={['지정 비중', '동일 비중', '절대 모멘텀', '최소 분산', '최대 다각화']}
          targetKey="method"
          updateParentObject={updateBackTestingInfos}
        />

        {backTestingInfos.method === '절대 모멘텀' && (
          <div className={classes.rsiContainer}>
            <label className={classes.label}>
              RSI 기간 (일):
              <input
                type="text"
                value={backTestingInfos.rsiPeriod}
                onChange={handleRsiChange}
                placeholder="숫자를 입력해주세요"
                className={classes.input}
              />
            </label>
            {rsiError && <p className={classes.error}>{rsiError}</p>}
          </div>
        )}

        <div className={classes.moneyContainer}>
          <label className={classes.label}>
            <h6>시작 금액 (₩):</h6>
            <input
              type="text"
              value={`${backTestingInfos.startMoney}₩`}
              onChange={handleMoneyChange}
              placeholder="금액 입력"
              className={classes.input}
            />
          </label>
        </div>

        <BackTestingAsset options="assets" updateParentObject={updateBackTestingInfos} />

        <button type="submit" className={classes.submitButton}>백테스트 실행</button>
      </div>

      <div className={classes.rightSection}>
        {holdingsData && (
          <FinancialReportGraph graphData={holdingsData} dataType="holdings" />
        )}
        {portfolioData && (
          <FinancialReportGraph graphData={portfolioData} dataType="portfolio" />
        )}
      </div>
    </form>
  );
}
