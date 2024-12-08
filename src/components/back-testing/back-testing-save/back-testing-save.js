'use client';
import { useState } from 'react';
import useAuthStore from "@/store/authStore";
import classes from './back-testing-save.module.css';

export default function BackTestingSave({ saveData, toggleModal }) {
  const { email } = useAuthStore();
  const [portfolioTitle, setPortfolioTitle] = useState(saveData.portfolio_name || '');

  const formatNumber = (num) => {
    return num ? num.toFixed(2) : '-';
  };

  const handleSave = async () => {
    // saveData에 이메일, 포트폴리오 제목 및 스크랩 추가
    const updatedSaveData = {
      ...saveData,
      email, // 사용자 이메일
      portfolio_title: portfolioTitle,
      scraps: 0, // 스크랩은 항상 0으로 설정
    };

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSaveData),
      });

      if (!response.ok) {
        throw new Error("포트폴리오 저장 실패");
      }

      const result = await response.json();
      alert("저장 완료되었습니다!");
      console.log("Saved Result:", result);

      // 저장 완료 후 모달 닫기
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
        <div className={classes.infoRow}><span>시작일:</span><span>{saveData.startDate}</span></div>
        <div className={classes.infoRow}><span>종료일:</span><span>{saveData.endDate}</span></div>
        <div className={classes.infoRow}><span>리밸런싱 주기:</span><span>{saveData.rebalancePeriod}</span></div>
        <div className={classes.infoRow}><span>리밸런싱 방법:</span><span>{saveData.method}</span></div>
        <div className={classes.infoRow}><span>시작 금액:</span><span>{saveData.startMoney}</span></div>
        <div className={classes.infoRow}><span>자산 목록:</span><span>{saveData.assets}</span></div>

        <h4>백테스팅 요약 정보</h4>
        <div className={classes.infoRow}><span>Sharpe Ratio:</span><span>{formatNumber(saveData.sharpe_ratio)}</span></div>
        <div className={classes.infoRow}><span>Kelly Ratio:</span><span>{formatNumber(saveData.kelly_ratio)}</span></div>
        <div className={classes.infoRow}><span>MDD:</span><span>{formatNumber(saveData.mdd)}</span></div>
        <div className={classes.infoRow}><span>최대 수익률:</span><span>{formatNumber(saveData.max_rate_return)}</span></div>
        <div className={classes.infoRow}><span>최종 수익률:</span><span>{formatNumber(saveData.rate_return)}</span></div>

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
