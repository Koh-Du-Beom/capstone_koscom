import { createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import useHoveredItemStore from '@/store/hoveredItemStore';
import styles from './mini-stock-graph.module.css';

export default function MiniGraph({ data }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null); // chart 인스턴스를 저장
  const { clearHoveredItem } = useHoveredItemStore(); // zustand의 상태 초기화 함수

  useEffect(() => {
    if (!data || !chartContainerRef.current) return;

    // 차트 생성
    chartRef.current = createChart(chartContainerRef.current, {
      width: 800, // 더 큰 width 설정
      height: 600, // 더 큰 height 설정
      layout: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
      },
      grid: {
        vertLines: { color: '#eeeeee' },
        horzLines: { color: '#eeeeee' },
      },
      priceScale: {
        borderColor: '#cccccc',
      },
      timeScale: {
        borderColor: '#cccccc',
      },
    });

    // 캔들스틱 시리즈 추가
    const candleSeries = chartRef.current.addCandlestickSeries();
    candleSeries.setData(data);

    return () => {
      // cleanup: 차트 제거
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [data]);

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={clearHoveredItem}>
        닫기
      </button>
      <div ref={chartContainerRef} className={styles.chart}></div>
    </div>
  );
}
