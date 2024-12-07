import React, { useState } from 'react';
import styles from './financial-dropdown.module.css';

export default function FinancialDropDown({ category, details, selectedIndicators, handleCheckboxChange }) {
  const [isOpen, setIsOpen] = useState(false);

  // 드롭다운 열기/닫기 토글
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // 체크박스 상태 변경 핸들러
  const handleChange = (event) => {
    const { name, checked } = event.target;
    handleCheckboxChange(name, checked);
  };

  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdownHeader} onClick={toggleDropdown}>
        <span>{category || 'Select Option'}</span>
        <span className={isOpen ? styles.arrowUp : styles.arrowDown}>▼</span>
      </div>

      {/* 드롭다운 메뉴 */}
      <div className={`${styles.dropdownMenu} ${isOpen ? styles.open : styles.closed}`}>
        {details &&
          details.map((detail, index) => (
            <label key={index} className={styles.dropdownItem}>
              <input
                type="checkbox"
                name={detail}
                checked={selectedIndicators.includes(detail)} // 선택된 상태 확인
                onChange={handleChange}
              />
              {detail}
            </label>
          ))}
      </div>
    </div>
  );
}
