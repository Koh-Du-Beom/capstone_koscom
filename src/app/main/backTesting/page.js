'use client';
import { useState, useEffect } from "react";
import BackTestingDropdown from "@/components/back-testing/back-testing-methods/back-testing-dropdown";
import BackTestingPeriod from "@/components/back-testing/back-testing-period/back-testing-period";
import BackTestingAsset from "@/components/back-testing/back-testing-assets/back-testing-assets";
import FinancialReportGraph from "@/components/graphs/financial-report-graph";
import classes from "./page.module.css";
import report_Mock_data from "@/components/graphs/financial-report-data";
import BackTestingSave from "@/components/back-testing/back-testing-save/back-testing-save";

export default function BacktestingPageTwo() {

  const [backTestingInfos, setBackTestingInfos] = useState({
    startDate: '',
    endDate: '',
    rebalancePeriod: '',
    method: '',
    startMoney: '',
    assets: '',
  });

  const [summaryInfos, setSummaryInfos] = useState({
    sharpe_ratio: '',
    kelly_ratio: '',
    rate_return : '',
    max_rate_return : '',
    mdd : '',
  })

  const [saveData, setSaveData] = useState({
    email : '',
    portfolio_title: '',
    scraps: 0,
    startDate: '',
    endDate: '',
    rebalancePeriod: '',
    method: '',
    startMoney: '',
    assets: '',
    sharpe_ratio: '',
    kelly_ratio: '',
    rate_return : '',
    max_rate_return : '',
    mdd : '',
  })

  const [portfolioData, setPortfolioData] = useState(null);
  const [holdingsData, setHoldingsData] = useState(null);

  const [showModal, setShowModal] = useState(false);

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

  // 백엔드 API에 요청을 보내는 함수
  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼의 기본 동작 방지

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
      setHoldingsData(data.holdings_proportions); // holdings 데이터 저장

      // performance_metrics에서 지표 추출
      const { sharpe_ratio, kelly_ratio, mdd } = data.performance_metrics;

      // portfolio_returns에서 returns 배열 추출
      const returnsArray = data.portfolio_returns.returns;
      const max_rate_return = Math.max(...returnsArray);
      const rate_return = returnsArray[returnsArray.length - 1];

      // summaryInfos 상태 업데이트
      setSummaryInfos({
        sharpe_ratio,
        kelly_ratio,
        mdd,
        rate_return,
        max_rate_return,
      });

      // saveData 상태 업데이트 (assets 제외하고 모두 덮어쓰기)
      setSaveData((prev) => ({
        ...prev,
        ...backTestingInfos,
        ...{
          sharpe_ratio,
          kelly_ratio,
          mdd,
          rate_return,
          max_rate_return,
        },
        assets: prev.assets,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("데이터 요청 중 문제가 발생했습니다.");
    }
  };


  const toggleModal = () => {
    setShowModal(!showModal);
  }

  return (
    <div className={classes.container}>
      <div className={classes.leftSection}>
        <h2 className={classes.title}>백테스팅 설정</h2>
        
        <div className={classes.buttonContainer}>
          <button type="button" onClick={toggleModal} className={classes.saveButton}>저장</button>
        </div>
        
        {/* 폼 시작 */}
        <form onSubmit={handleSubmit} className={classes.inputSection}>
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
            options={['지정 비중', '동일 비중', '절대 모멘텀', '최소 분산', '최대 다각화', '리스크 패리티']}
            targetKey="method"
            updateParentObject={updateBackTestingInfos}
          />

          <div className={classes.moneyContainer}>
            <label className={classes.label}>
              시작 금액 (₩):
              <input
                type="text"
                value={`${backTestingInfos.startMoney}₩`}
                onChange={handleMoneyChange}
                placeholder="금액 입력"
                className={classes.input}
              />
            </label>
          </div>

          <BackTestingAsset
            options="assets"
            updateParentObject={updateBackTestingInfos}
            updateSaveDataAssets={(assets) => setSaveData((prev) => ({ ...prev, assets }))}
          />

          <button type="submit" className={classes.submitButton}>백테스트 실행</button>
        </form>
        {/* 폼 종료 */}
      </div>

      <div className={classes.rightSection}>
        {holdingsData && (
          <FinancialReportGraph graphData={holdingsData} dataType="holdings" />
        )}
        {portfolioData && (
          <FinancialReportGraph graphData={portfolioData} dataType="portfolio" />
        )}
      </div>

      {showModal && (
        <BackTestingSave
          saveData={saveData}
          toggleModal={toggleModal}
        />
      )}
    </div>
  );
}
