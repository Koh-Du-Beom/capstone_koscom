'use client';
import { useState, useEffect } from "react";
import SimpleStockListModal from "@/components/modal/stock-list-modal/stock-list-modal";
import classes from './back-testing-assets.module.css';
import useAuthStore from "@/store/authStore";

export default function BackTestingAsset({ options, updateParentObject }) {
  const { interestedItems } = useAuthStore();
  
  const [selectedStocks, setSelectedStocks] = useState([]); // 선택된 주식 목록
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [stockRatios, setStockRatios] = useState({}); // 각 주식의 비율
  const [ratioError, setRatioError] = useState(""); // 비율 입력 오류 메시지 상태

  // 종목과 비율을 상위 컴포넌트에 업데이트
  const updateFormattedStocks = () => {
    const formattedStocks = selectedStocks
      .map(stock => `${stock.code},${stockRatios[stock.code] || 0}`)
      .join(";");

    updateParentObject(options, formattedStocks);
  };

  useEffect(() => {
    if (interestedItems && interestedItems.length > 0) {
      const extractedStocks = interestedItems.map((item) => ({
        name: item.name,
        code: item.code,
      }));
  
      setSelectedStocks(extractedStocks); // selectedStocks 업데이트
    }
  }, [interestedItems]);
  

  // 비율 합이 100%인지 확인하고 오류 메시지 설정
  const checkTotalRatio = () => {
    const totalRatio = Object.values(stockRatios).reduce((sum, ratio) => sum + Number(ratio || 0), 0);
    if (selectedStocks.length >= 1 && totalRatio !== 100) {
      setRatioError("비율의 합이 100%가 되어야 합니다.");
    } else {
      setRatioError("");
    }
  };

  useEffect(() => {
    checkTotalRatio();
    updateFormattedStocks();
  }, [selectedStocks, stockRatios]);

  // 모달에서 종목 추가 시 호출되는 함수
  const handleAddStock = (stock) => {
    const isAlreadySelected = selectedStocks.some(
      (item) => item.code === stock.code
    );

    if (isAlreadySelected) {
      alert("이미 선택된 종목입니다.");
      return;
    }

    setSelectedStocks((prevStocks) => [
      ...prevStocks,
      { code: stock.code, name: stock.name },
    ]);
    setIsModalOpen(false); // 모달창 닫기
  };

  // 비율 입력값 검증 및 업데이트 함수
  const handleRatioChange = (code, event) => {
    const value = event.target.value;
    if (value === "" || /^\d+$/.test(value)) { // 빈 문자열 또는 숫자만 허용
      setStockRatios((prevRatios) => ({
        ...prevRatios,
        [code]: value,
      }));
    } else {
      setRatioError("숫자를 입력해주세요.");
    }
  };

  const handleDeleteStock = (code) => {
    setSelectedStocks((prevStocks) => prevStocks.filter((stock) => stock.code !== code));
    setStockRatios((prevRatios) => {
      const updatedRatios = { ...prevRatios };
      delete updatedRatios[code];
      return updatedRatios;
    });
  };

  return (
    <div className={classes.assetContainer}>
      <div className={classes.stockListContainer}>
        {selectedStocks.length > 0 && selectedStocks.map((stock) => (
          <div key={stock.code} className={classes.stockItem}>
            <span>{`${stock.name}(${stock.code})`}</span>
            <div className={classes.inputContainer}>
              <input
                type="text"
                value={stockRatios[stock.code] || ""}
                onChange={(event) => handleRatioChange(stock.code, event)}
                placeholder="비율 입력 (%)"
                className={classes.ratioInput}
              />
              <button
                onClick={() => handleDeleteStock(stock.code)}
                className={classes.deleteButton}
                type="button"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {ratioError && <p className={classes.error}>{ratioError}</p>}

      <button type="button" onClick={() => setIsModalOpen(true)} className={classes.selectButton}>+</button>

      {isModalOpen && (
        <SimpleStockListModal
          onClose={() => setIsModalOpen(false)}
          onAddItem={handleAddStock}
        />
      )}
    </div>
  );
}
