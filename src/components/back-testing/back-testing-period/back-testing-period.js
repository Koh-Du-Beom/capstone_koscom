import React, { useState, useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './back-testing-period.module.css';

// 한국어 로케일 등록
registerLocale('ko', ko);

export default function BackTestingPeriod({ options, updateParentObject }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const datePickerRef = useRef(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = formatToYYMMDD(date);
      updateParentObject(options, formattedDate);
    }

    // 날짜 선택 후 화면 밖으로 포커스 이동
    setTimeout(() => document.activeElement.blur(), 0.00001);
  };

  const formatToYYMMDD = (date) => {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  };

  return (
    <div className={styles.datePickerContainer}>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy년 MM월 dd일"
        locale="ko"
        className={styles.datePickerInput}
        placeholderText="날짜를 선택하세요"
        onKeyDown={(e) => e.preventDefault()} // 키보드 입력 차단
        ref={datePickerRef}
        renderCustomHeader={({ date, changeYear, changeMonth }) => (
          <div className={styles.customHeader}>
            <select
              value={date.getFullYear()}
              onChange={({ target: { value } }) => changeYear(value)}
              className={styles.selectYear}
            >
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}년
                </option>
              ))}
            </select>
            <select
              value={date.getMonth()}
              onChange={({ target: { value } }) => changeMonth(value)}
              className={styles.selectMonth}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {i + 1}월
                </option>
              ))}
            </select>
          </div>
        )}
      />
    </div>
  );
}
