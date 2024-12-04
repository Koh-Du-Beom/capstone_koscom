import { useState } from 'react';
import classes from './interested-items.module.css';
import Image from 'next/image';
import KospiLogo from '../../../public/svgs/kospi.svg';
import KosdaqLogo from '../../../public/svgs/kosdaq.svg';
import MiniGraph from '../mini-graph/mini-graph';

export default function InterestedItems({ items, isEditMode, onRemoveItem }) {
  const [hoveredItem, setHoveredItem] = useState(null); // 현재 hover된 item의 데이터를 저장
  const [graphData, setGraphData] = useState(null); // hover된 item의 그래프 데이터를 저장
  const [loading, setLoading] = useState(false); // API 호출 중 로딩 상태 관리

  const handleMouseEnter = async (item) => {
    setHoveredItem(item);
    setLoading(true);
    try {
      const response = await fetch('/api/mini-stockGraph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockCode: item.code }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch graph data');
      }

      const data = await response.json();
      setGraphData(data); // 그래프 데이터 저장
    } catch (error) {
      console.error('Error fetching graph data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setGraphData(null);
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
            onMouseLeave={handleMouseLeave}
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

            {isEditMode && (
              <button
                className={classes.deleteButton}
                onClick={() => onRemoveItem(item.code)}
              >
                삭제
              </button>
            )}

            {/* Hover된 아이템에 대해 MiniGraph 컴포넌트 렌더링 */}
            {hoveredItem?.code === item.code && (
              <div className={classes.miniGraphContainer}>
                {loading ? (
                  <p>Loading graph...</p>
                ) : (
                  <MiniGraph data={graphData} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
