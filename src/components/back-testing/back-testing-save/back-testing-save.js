'use client';
import { useState } from 'react';
import useAuthStore from "@/store/authStore";
import classes from './back-testing-save.module.css';

export default function BackTestingSave({ backTestingInfos, summaryInfos, toggleModal }) {
  const { email } = useAuthStore(); 
  const [portfolioTitle, setPortfolioTitle] = useState('');

  const formatNumber = (num) => {
    return num ? num.toFixed(2) : '-';
  };

  const handleSave = async () => {
    const saveData = {
      email,
      portfolio_title: portfolioTitle,
      scraps: 0, // Always 0
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
      toggleModal();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContent}>
        <button className={classes.closeButton} onClick={toggleModal}>X</button>
        <h4>포트폴리오 정보</h4>
        <div className={classes.infoRow}>
          <span>이메일:</span>
          <span>{email}</span>
        </div>
        <div className={classes.infoRow}>
          <span>포트폴리오 제목:</span>
          <input
            type="text"
            value={portfolioTitle}
            onChange={(e) => setPortfolioTitle(e.target.value)}
            placeholder="포트폴리오 제목을 입력하세요."
            className={classes.inputSmall}
          />
        </div>


        <h4>백테스팅 설정 정보</h4>
        <div className={classes.infoRow}><span>시작일:</span><span>{backTestingInfos.startDate}</span></div>
        <div className={classes.infoRow}><span>종료일:</span><span>{backTestingInfos.endDate}</span></div>
        <div className={classes.infoRow}><span>리밸런싱 주기:</span><span>{backTestingInfos.rebalancePeriod}</span></div>
        <div className={classes.infoRow}><span>리밸런싱 방법:</span><span>{backTestingInfos.method}</span></div>
        <div className={classes.infoRow}><span>시작 금액:</span><span>{backTestingInfos.startMoney}</span></div>
        <div className={classes.infoRow}><span>자산 목록:</span><span>{backTestingInfos.assets}</span></div>

        <h4>백테스팅 요약 정보</h4>
        <div className={classes.infoRow}><span>Sharpe Ratio:</span><span>{formatNumber(summaryInfos.sharpe_ratio)}</span></div>
        <div className={classes.infoRow}><span>Kelly Ratio:</span><span>{formatNumber(summaryInfos.kelly_ratio)}</span></div>
        <div className={classes.infoRow}><span>MDD:</span><span>{formatNumber(summaryInfos.mdd)}</span></div>
        <div className={classes.infoRow}><span>최대 수익률:</span><span>{formatNumber(summaryInfos.max_rate_return)}</span></div>
        <div className={classes.infoRow}><span>최종 수익률:</span><span>{formatNumber(summaryInfos.rate_return)}</span></div>

        <button 
          onClick={handleSave} 
          disabled={!portfolioTitle}
          className={`${classes.saveButton} ${!portfolioTitle && classes.disabledButton}`}
        >
          저장완료
        </button>
      </div>
    </div>
  );
}
