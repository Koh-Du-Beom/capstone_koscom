import { createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

export default function MiniGraph({ data }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null); // chart 인스턴스를 저장

  useEffect(() => {
    if (!data || !chartContainerRef.current) return;

    // 차트 생성
    chartRef.current = createChart(chartContainerRef.current, {
      width: 400, // Mini graph 크기
      height: 300,
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

  return <div ref={chartContainerRef}></div>;
}
