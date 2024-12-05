import useHoveredItemStore from '@/store/hoveredItemStore';
import classes from './interested-items.module.css';
import Image from 'next/image';
import KospiLogo from '../../../public/svgs/kospi.svg';
import KosdaqLogo from '../../../public/svgs/kosdaq.svg';
import { useState, useRef } from 'react';
import ComponentLoading from '../loading/component-loading';

export default function InterestedItems({ items, isEditMode, onRemoveItem }) {
  const { setHoveredItem } = useHoveredItemStore(); // Zustand 상태 함수
  const [loadingItemCode, setLoadingItemCode] = useState(null); // 특정 항목에 대한 로딩 상태 관리
  const abortControllerRef = useRef(null); // AbortController를 저장하는 ref

  const handleMouseEnter = async (item) => {
    if (isEditMode) return; // 편집 모드에서는 hoveredItem 업데이트를 막음

    // 이전 요청이 있으면 중단
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController(); // 새 AbortController 생성
    abortControllerRef.current = controller; // ref에 저장

    setLoadingItemCode(item.code); // 로딩 중인 항목 설정
    try {
      const response = await fetch('/api/mini-stock-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockCode: item.code }),
        signal: controller.signal, // 요청에 AbortController의 signal 추가
      });

      if (!response.ok) {
        throw new Error('Failed to fetch graph data');
      }

      const data = await response.json();
      setHoveredItem({ ...item, graphData: data }); // 그래프 데이터 포함하여 상태 업데이트
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted'); // 요청이 중단되었음을 로그로 표시
      } else {
        console.error('Error fetching graph data:', error);
      }
    } finally {
      setLoadingItemCode(null); // 로딩 종료
    }
  };

  const handleMouseLeave = () => {
    // hover 중단 시 요청 중단
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null; // controller 초기화
    }
  };

  return (
    <>
      {items.map((item, index) => {
        if (!item) return null;

        const currentPrice = Number(item.mkp);
        const priceChangeValue = Number(item.priceChange);
        const priceChangeRateValue = parseFloat(item.priceChangeRate);

        return (
          <div
            className={`${classes.container} ${classes.hoverable}`} // hover 스타일 클래스 추가
            key={index}
            onMouseEnter={() => handleMouseEnter(item)}
            onMouseLeave={handleMouseLeave} // mouseLeave 시 요청 중단
          >
            <div className={classes.logo}>
              <Image
                src={item.marketCategory === 'KOSPI' ? KospiLogo : KosdaqLogo}
                alt={`${item.marketCategory} logo`}
                width={100}
                height={100}
              />
            </div>
            <div className={classes.wrapper}>
              <div className={classes.title_box}>
                <h1 className={classes.big_title}>{item.name}</h1>
                <h3 className={classes.small_title}>{item.code}</h3>
              </div>

              <div className={classes.price_info}>
                <h4 className={classes.current_price}>
                  {currentPrice.toLocaleString()}
                </h4>
                <div className={classes.price_change_box}>
                  <h6
                    className={`${classes.price_change} ${
                      priceChangeValue > 0
                        ? classes.priceChangeUp
                        : classes.priceChangeDown
                    }`}
                  >
                    {priceChangeValue > 0
                      ? `+${priceChangeValue.toLocaleString()}`
                      : priceChangeValue.toLocaleString()}{' '}
                    (
                    {priceChangeRateValue > 0
                      ? `+${priceChangeRateValue.toFixed(2)}`
                      : priceChangeRateValue.toFixed(2)}
                    %)
                  </h6>
                  <span
                    className={`${classes.arrow} ${
                      priceChangeValue > 0
                        ? classes.arrowUp
                        : classes.arrowDown
                    }`}
                  ></span>
                </div>
              </div>
            </div>

            {isEditMode ? (
              <button
                className={classes.deleteButton}
                onClick={() => onRemoveItem(item.code)}
              >
                삭제
              </button>
            ) : (
              loadingItemCode === item.code && ( // 특정 항목에만 로딩 컴포넌트 표시
                <div className={classes.componentLoading}>
                  <ComponentLoading />
                </div>
              )
            )}
          </div>
        );
      })}
    </>
  );
}
