'use client';

import { useState, useEffect } from 'react';
import { useInterestedItems } from '@/contexts/InterestedItemsContext';
import RecentReportItem from '@/components/recent-report/recent-report-item';
import classes from './recent-report-box.module.css';

export default function RecentReportItemBox() {
  const { interestedItems } = useInterestedItems();
  const [selectedStock, setSelectedStock] = useState(null); // 드롭다운 종목 선택 시, 업데이트
  const [clientItems, setClientItems] = useState([]); // 관심종목에서 가져온 목록을 로컬 상태에 저장
  const [reports, setReports] = useState([]); // 리포트 데이터를 저장하는 상태

  useEffect(() => {
    setClientItems(interestedItems);

    // 관심종목이 존재할 때 첫 번째 항목을 초기값으로 설정
    if (interestedItems.length > 0) {
      const initialStock = interestedItems[0];
      setSelectedStock(initialStock);

      // 첫 번째 항목에 대한 리포트 데이터 가져오기
      fetchReports(initialStock.code);
    }
  }, [interestedItems]);

  const fetchReports = async (stockcode) => {
    try {
      // 백엔드 API에 요청을 보내 선택된 stockcode의 리포트 데이터를 받아옴
      const response = await fetch('/api/get-recent-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockcode })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const data = await response.json();
      setReports(data); // 받은 데이터를 reports 상태에 저장
    } catch (error) {
      console.error('Error fetching report data:', error);
      setReports([]); // 에러 발생 시 reports를 빈 배열로 초기화
    }
  };

  const handleDropdownChange = async (event) => {
    const selectedCode = event.target.value;
    const selectedItem = clientItems.find(item => item.code === selectedCode);

    if (selectedItem) {
      setSelectedStock(selectedItem);
      fetchReports(selectedCode); // 선택된 항목의 리포트 데이터 가져오기
    } else {
      setSelectedStock(null);
      setReports([]); // 선택된 항목이 없을 경우 reports를 빈 배열로 초기화
    }
  };

  return (
    <div className={classes.container}>
      <select onChange={handleDropdownChange} className={classes.dropdown} value={selectedStock?.code || ''}>
        {clientItems.map((item) => (
          <option key={item.code} value={item.code}>
            {item.name}
          </option>
        ))}
      </select>

      <div className={classes.reports}>
        {reports.map((report, index) => (
          <RecentReportItem key={index} report={report} />
        ))}
      </div>
    </div>
  );
}
