'use client';
import { useState, useEffect } from "react";
import BackTestingDropdown from "@/components/back-testing/back-testing-methods/back-testing-dropdown";
import BackTestingPeriod from "@/components/back-testing/back-testing-period/back-testing-period";
import BackTestingAsset from "@/components/back-testing/back-testing-assets/back-testing-assets";
import { getLocalStorageItems, setLocalStorageItems } from "@/utils/localStorage";
import FinancialReportGraph from "@/components/graphs/financial-report-graph";
import classes from "./page.module.css";

import report_Mock_data from "@/components/graphs/financial-report-data";

const PORTFOLIO_STORAGE_KEY = 'savedPortfolioData';

// 메인 백테스트 페이지 컴포넌트 
export default function BacktestingPageTwo() {
  const [backTestingInfos, setBackTestingInfos] = useState({
    startDate: '', // 시작일
    endDate: '', // 종료일
    rebalancePeriod: '', // 리밸런싱 주기  
    method: '', // 리밸런싱 방법
    momentumStartDate: '', // 모멘텀 계산 시작 월 (절대 모멘텀에서 사용)
    momentumEndDate: '', // 모멘텀 계산 끝 월 (절대 모멘텀에서 사용)
    riskPeriod: '', // 리스크 패리티 계산 기간 (리스크 패리티에서 사용)
    riskMinWeight: '', // 리스크 패리티 최소 비중 (리스크 패리티에서 사용) 
    riskMaxWeight: '', // 리스크 패리티 최대 비중 (리스크 패리티에서 사용) 
    variancePeriod: '', // 최소 분산 계산 기간 (최소 분산에서 사용)
    varianceMinWeight: '', // 최소 분산 최소 비중 (최소 분산에서 사용) 
    varianceMaxWeight: '', // 최소 분산 최대 비중 (최소 분산에서 사용)
    diversificationPeriod: '', // 최대 다각화 계산 기간 (최대 다각화에서 사용)
    diversificationMinWeight: '', // 최대 다각화 최소 비중 (최대 다각화에서 사용) 
    diversificationMaxWeight: '', // 최대 다각화 최대 비중 (최대 다각화에서 사용)  
    startMoney: '', // 시작 금액 
    assets: '', // 선택한 주식 종목
  });

  const [momentumError, setMomentumError] = useState("");
  const [minWeightError, setMinWeightError] = useState("");
  const [maxWeightError, setMaxWeightError] = useState("");
  const [portfolioData, setPortfolioData] = useState(null);
  const [holdingsData, setHoldingsData] = useState(null);

  // 설정값 업데이트 함수 
  const updateBackTestingInfos = (key, value) => {
    setBackTestingInfos((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 시작 금액 관련 함수 
  const handleMoneyChange = (event) => {
    const input = event.target.value.replace(/[^\d]/g, "");  // 숫자 외의 문자 제거 
    const formattedValue = input.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 천 단위 콤마 표시
    updateBackTestingInfos("startMoney", formattedValue);
  };

  const handleMinWeightChange = (event, strategyType) => {
    const value = event.target.value;
  
    updateBackTestingInfos(
      strategyType === "리스크 패리티" ? "riskMinWeight" :
      strategyType === "최소 분산" ? "varianceMinWeight" :
      "diversificationMinWeight",
      value
    );
  
    // 입력값 검증
    if (value === "" || (/^\d+$/.test(value) && value >= 0 && value <= 100)) {
      setMinWeightError(""); // 올바른 입력값
    } else {
      setMinWeightError("0에서 100 사이의 숫자를 입력해주세요.");
    }
  };
  
  
  // 최대 비중 검증 로직 : 리스크 패리티, 최소 분산에서 사용
  const handleMaxWeightChange = (event, strategyType) => {
    const value = event.target.value;
    updateBackTestingInfos(
      strategyType === "리스크 패리티" ? "riskMaxWeight" :
      strategyType === "최소 분산" ? "varianceMaxWeight" :
      "diversificationMaxWeight",
      value
    );
  
    // 입력값 검증
    if (value === "" || (/^\d+$/.test(value) && value >= 0 && value <= 100)) {
      setMaxWeightError(""); // 올바른 입력값
    } else {
      setMaxWeightError("0에서 100 사이의 숫자를 입력해주세요.");
    }
  };
  

  // 로컬 스토리지에 현재 설정값 저장 
  const handleSave = () => {
    // 저장하려는 데이터 필터링
    const { method, ...rest } = backTestingInfos;
  
    // 방식별로 필요한 데이터만 필터링
    let filteredData = { method, startDate: rest.startDate, endDate: rest.endDate, startMoney: rest.startMoney, assets: rest.assets };
  
    if (method === "리스크 패리티") {
      filteredData = {
        ...filteredData,
        riskMinWeight: rest.riskMinWeight,
        riskMaxWeight: rest.riskMaxWeight,
        riskPeriod: rest.riskPeriod,
      };
    } else if (method === "최소 분산") {
      filteredData = {
        ...filteredData,
        varianceMinWeight: rest.varianceMinWeight,
        varianceMaxWeight: rest.varianceMaxWeight,
        variancePeriod: rest.variancePeriod,
      };
    } else if (method === "최대 다각화") {
      filteredData = {
        ...filteredData,
        diversificationMinWeight: rest.diversificationMinWeight,
        diversificationMaxWeight: rest.diversificationMaxWeight,
        diversificationPeriod: rest.diversificationPeriod,
      };
    } else if (method === "절대 모멘텀") {
      filteredData = {
        ...filteredData,
        momentumStartDate: rest.momentumStartDate,
        momentumEndDate: rest.momentumEndDate,
      };
    }
  
    // 유효성 검증
    if (!filteredData.startDate || !filteredData.endDate || !filteredData.startMoney) {
      alert("시작일, 종료일, 시작 금액을 입력해주세요.");
      return;
    }
  
    // 저장
    setLocalStorageItems(PORTFOLIO_STORAGE_KEY, filteredData);
    alert("설정이 저장되었습니다.");
  };

  
  // 로컬 스토리지에서 설정값 불러오기 
  const handleLoad = () => {
    const savedData = getLocalStorageItems(PORTFOLIO_STORAGE_KEY);
  
    if (savedData) {
      // 불러온 데이터의 유효성 검증
      if (!savedData.startDate || !savedData.endDate || !savedData.startMoney) {
        alert("저장된 데이터가 유효하지 않습니다. 기본값으로 초기화합니다.");
        setBackTestingInfos({
          startDate: "",
          endDate: "",
          rebalancePeriod: "",
          method: "",
          startMoney: "",
          assets: "",
        });
        return;
      }
  
      // 상태 업데이트
      setBackTestingInfos(savedData);
      alert("저장된 설정이 불러와졌습니다.");
    } else {
      alert("저장된 설정이 없습니다.");
    }
  };


  // 백엔드 API에서 요청 주고받기
  const handleSubmit = async (event) => {
      event.preventDefault();
  
      // 리밸런싱 주기나 기타 기간 데이터를 숫자로 변환
      const convertToMonths = (period) => {
          if (period.includes('개월')) {
              return parseInt(period.replace('개월', '').trim(), 10); // '6개월' -> 6
          } else if (period.includes('년')) {
              return parseInt(period.replace('년', '').trim(), 10) * 12; // '1년' -> 12
          }
          return parseInt(period.trim(), 10); // 숫자만 있는 경우 그대로 사용
      };
  
      // 금액 문자열을 숫자로 변환
      const convertToNumber = (money) => {
          return parseInt(money.replace(/,/g, ''), 10); // "10,000,000" -> 10000000
      };
  
      // 선택된 방법에 따라 필요한 값만 남기기
      const { method, startDate, endDate, rebalancePeriod, assets, startMoney, ...others } = backTestingInfos;
  
      // startMoney를 숫자로 변환
      const numericStartMoney = convertToNumber(startMoney);
  
      // 공통 필드
      let filteredData = { method, startDate, endDate, rebalancePeriod, assets, startMoney: numericStartMoney };
  
      // 방법별 추가 필드
      if (method === '리스크 패리티') {
          filteredData = {
              ...filteredData,
              riskMinWeight: others.riskMinWeight,
              riskMaxWeight: others.riskMaxWeight,
              riskPeriod: others.riskPeriod,
          };
      } else if (method === '최소 분산') {
          filteredData = {
              ...filteredData,
              varianceMinWeight: others.varianceMinWeight,
              varianceMaxWeight: others.varianceMaxWeight,
              variancePeriod: others.variancePeriod,
          };
      } else if (method === '최대 다각화') {
          filteredData = {
              ...filteredData,
              diversificationMinWeight: others.diversificationMinWeight,
              diversificationMaxWeight: others.diversificationMaxWeight,
              diversificationPeriod: others.diversificationPeriod,
          };
      } else if (method === '절대 모멘텀') {
          filteredData = {
              ...filteredData,
              momentumStartDate: others.momentumStartDate,
              momentumEndDate: others.momentumEndDate,
          };
      }
  
      // 디버깅용 데이터 출력
      console.log("Filtered data to be sent to backend:", filteredData);
  
      try {
          const response = await fetch('/api/runBackTesting', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(filteredData),
          });
  
          if (!response.ok) {
              throw new Error("데이터 요청에 실패했습니다.");
          }
  
          const data = await response.json();
          console.log("Response from backend:", data);
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  };

  return (
    <div className={classes.container}> 
      <div className={classes.leftSection}>
        <h2 className={classes.title}>백테스팅 설정</h2> {/* 페이저 제목 */}
        
        <div className={classes.buttonContainer}> {/* 저장, 불러오기 버튼 */}
          <button type="button" onClick={handleSave} className={classes.saveButton}>저장</button>
          <button type="button" onClick={handleLoad} className={classes.loadButton}>불러오기</button>
        </div>
        
        <div className={classes.inputSection}> {/* 입력값 설정 섹션 */}
          <h6>시작일</h6> 
          <BackTestingPeriod options="startDate" updateParentObject={updateBackTestingInfos} />
          <h6>종료일</h6>
          <BackTestingPeriod options="endDate" updateParentObject={updateBackTestingInfos} />

          {/* 시작 금액 입력칸 */}
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
          
          <h6>리밸런싱 주기</h6>
          <BackTestingDropdown
            options={['1개월', '3개월', '6개월', '1년']}
            targetKey="rebalancePeriod"
            updateParentObject={updateBackTestingInfos}
          />

          <h6>리밸런싱 방법</h6>
          <BackTestingDropdown
            options={['지정 비중', '동일 비중', '절대 모멘텀', '리스크 패리티', '최소 분산', '최대 다각화']}
            targetKey="method"
            updateParentObject={updateBackTestingInfos}
          />
  
          {/* 절대 모멘텀 선택 시 입력 필드 표시 */}
          {backTestingInfos.method === '절대 모멘텀' && (
            <div className={classes.rsiPeriod}>
              <label className={classes.label}>
              <h6>과거 데이터 선택 기간</h6>
              
              시작일 : 
              <BackTestingPeriod options="momentumStartDate" updateParentObject={updateBackTestingInfos} />

              종료일 : 
              <BackTestingPeriod options="momentumEndDate" updateParentObject={updateBackTestingInfos} />

              </label>
            </div>
          )}

          {/* 리스크 패리티 선택 시 입력 필드 표시 */}
          {backTestingInfos.method === '리스크 패리티' && (
            <div className={classes.rsiPeriod}>
              <label className={classes.label}>
              <h6>과거 데이터 선택 기간</h6>
              
              <BackTestingDropdown
                options={['1개월', '2개월', '3개월', '4개월', '5개월', '6개월',
                          '7개월', '8개월', '9개월', '10개월', '11개월', '12개월']}
                targetKey="riskPeriod"
                updateParentObject={updateBackTestingInfos}
              />
              </label>

              {/* 최소 비중 입력칸 */}
                <label className={classes.label}>
                    최소 비중 (%) : 
                    <input
                      type="text"
                      value={backTestingInfos.riskMinWeight || ""}
                      onChange={(e) => handleMinWeightChange(e, "리스크 패리티")}
                      className={classes.input}
                    />
                </label>
                
              {/* 최대 비중 입력칸 */}
                <label className={classes.label}>
                    최대 비중 (%) : 
                    <input
                      type="text"
                      value={backTestingInfos.riskMaxWeight}
                      onChange={(e) => handleMaxWeightChange(e, "리스크 패리티")}
                      className={classes.input}
                    />
                </label>                      
            </div>
          )}

          {/* 최소 분산 선택 시 입력 필드 표시 */}
          {backTestingInfos.method === '최소 분산' && (
            <div className={classes.rsiPeriod}>
              <label className={classes.label}>
              <h6>과거 데이터 선택 기간</h6>
              
              <BackTestingDropdown
                options={['1개월', '2개월', '3개월', '4개월', '5개월', '6개월',
                          '7개월', '8개월', '9개월', '10개월', '11개월', '12개월']}
                targetKey="variancePeriod"
                updateParentObject={updateBackTestingInfos}
              />
              </label>

              {/* 최소 비중 입력칸 */}
                <label className={classes.label}>
                    최소 비중 (%) : 
                    <input
                      type="text" 
                      value={backTestingInfos.varianceMinWeight}
                      onChange={(e) => handleMinWeightChange(e, "최소 분산")}
                      className={classes.input}
                    />
                </label>
                
              {/* 최대 비중 입력칸 */}
                <label className={classes.label}>
                    최대 비중 (%) : 
                    <input
                      type="text"
                      value={backTestingInfos.varianceMaxWeight}
                      onChange={(e) => handleMaxWeightChange(e, "최소 분산")}
                      className={classes.input}
                    />
                </label>                      
            </div>
          )}

          {/* 최대 다각화 선택 시 입력 필드 표시 */}
          {backTestingInfos.method === '최대 다각화' && (
            <div className={classes.rsiPeriod}>
              <label className={classes.label}>
              <h6>과거 데이터 선택 기간</h6>
              
              <BackTestingDropdown
                options={['1개월', '2개월', '3개월', '4개월', '5개월', '6개월',
                          '7개월', '8개월', '9개월', '10개월', '11개월', '12개월']}
                targetKey="diversificationPeriod"
                updateParentObject={updateBackTestingInfos}
              />
              </label>

              {/* 최소 비중 입력칸 */}
                <label className={classes.label}>
                    최소 비중 (%) : 
                    <input
                      type="text"
                      value={backTestingInfos.diversificationMinWeight}
                      onChange={(e) => handleMaxWeightChange(e, "최대 다각화")}
                      className={classes.input}
                    />
                </label>
                
              {/* 최대 비중 입력칸 */} 
                <label className={classes.label}>
                    최대 비중 (%) : 
                    <input
                      type="text"
                      value={backTestingInfos.diversificationMaxWeight}
                      onChange={(e) => handleMaxWeightChange(e, "최대 다각화")}
                      className={classes.input}
                    />
                </label>                      
            </div>
          )}

          {/* 주식 종목 선택 */}
          <BackTestingAsset options="assets" updateParentObject={updateBackTestingInfos} />

          {/* 백테스트 실행 버튼 */}
          <button type="submit" className={classes.submitButton} onClick={handleSubmit}>백테스트 실행</button>
        </div>
      </div>

      {/* 결과 그래프 표시  */}
      <div className={classes.rightSection}>
        {holdingsData && (
          <FinancialReportGraph graphData={holdingsData} dataType="holdings" />
        )}
        {portfolioData && (
          <FinancialReportGraph graphData={portfolioData} dataType="portfolio" />
        )}
      </div>
    </div>
  );
}