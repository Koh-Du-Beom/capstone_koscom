'use client';
import { useState } from 'react';
import useAuthStore from "@/store/authStore";
import classes from './back-testing-save.module.css';

export default function BackTestingSave({ backTestingInfos, summaryInfos, toggleModal }) {
  const { email } = useAuthStore(); 
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [scraps, setScraps] = useState(0);

  const handleSave = async () => {
    const saveData = {
      email,
      portfolio_title: portfolioTitle,
      scraps: 0,
      ...backTestingInfos,
      ...summaryInfos,
    };

    try {
      const response = await fetch('/api/savePortfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });

      if (!response.ok) {
        throw new Error("포트폴리오 저장 실패");
      }

      const result = await response.json();
      alert("저장 완료되었습니다!");
      console.log("Saved Result:", result);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContent}>
        <button className={classes.closeButton} onClick={toggleModal}>X</button>
        <h3>백테스팅 결과 저장</h3>

        <div>
          <label>이메일:</label>
          <span>{email}</span>
        </div>

        <div>
          <label>포트폴리오 제목:</label>
          <input
            type="text"
            value={portfolioTitle}
            onChange={(e) => setPortfolioTitle(e.target.value)}
            placeholder="포트폴리오 제목을 입력하세요."
          />
        </div>

        <div>
          <label>메모 (scraps):</label>
          <textarea
            value={scraps}
            onChange={(e) => setScraps(e.target.value)}
            placeholder="포트폴리오에 대한 메모를 남겨주세요."
          />
        </div>

        <h4>백테스팅 설정 정보</h4>
        <ul>
          <li>시작일: {backTestingInfos.startDate}</li>
          <li>종료일: {backTestingInfos.endDate}</li>
          <li>리밸런싱 주기: {backTestingInfos.rebalancePeriod}</li>
          <li>리밸런싱 방법: {backTestingInfos.method}</li>
          <li>시작 금액: {backTestingInfos.startMoney}</li>
          <li>자산 목록: {backTestingInfos.assets}</li>
        </ul>

        <h4>백테스팅 요약 정보</h4>
        <ul>
          <li>Sharpe Ratio: {summaryInfos.sharpe_ratio}</li>
          <li>Kelly Ratio: {summaryInfos.kelly_ratio}</li>
          <li>MDD: {summaryInfos.mdd}</li>
          <li>최대 수익률: {summaryInfos.max_rate_return}</li>
          <li>최종 수익률: {summaryInfos.rate_return}</li>
        </ul>

        <button onClick={handleSave}>저장완료</button>
      </div>
    </div>
  );
}
