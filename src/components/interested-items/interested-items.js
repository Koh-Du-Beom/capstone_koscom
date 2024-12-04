import useHoveredItemStore from '@/store/hoveredItemStore';
import classes from './interested-items.module.css';
import Image from 'next/image';
import KospiLogo from '../../../public/svgs/kospi.svg';
import KosdaqLogo from '../../../public/svgs/kosdaq.svg';
import { useState } from 'react';
import ComponentLoading from '../loading/component-loading';

export default function InterestedItems({ items, isEditMode, onRemoveItem }) {
  const { setHoveredItem } = useHoveredItemStore(); // Zustand 상태 함수
  const [loading, setLoading] = useState(false); // API 호출 중 로딩 상태 관리

  const handleMouseEnter = async (item) => {
    if (isEditMode) return; // 편집 모드에서는 hoveredItem 업데이트를 막음

    setLoading(true); // 로딩 시작
    try {
      const response = await fetch('/api/mini-stock-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockCode: item.code }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch graph data');
      }

      const data = await response.json();
      setHoveredItem({ ...item, graphData: data }); // 그래프 데이터 포함하여 상태 업데이트
    } catch (error) {
      console.error('Error fetching graph data:', error);
    } finally {
      setLoading(false); // 로딩 종료
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
            className={classes.container}
            key={index}
            onMouseEnter={() => handleMouseEnter(item)}
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
              loading && (
                <div className={classes.componentLoading}> 
                  <ComponentLoading />
                </div>
                // 따로 css만드는거보단 저 위치 그대로 놓고싶어서
              )
            )}
          </div>
        );
      })}
    </>
  );
}
