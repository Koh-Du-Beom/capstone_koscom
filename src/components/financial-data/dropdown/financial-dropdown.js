import React, { useState } from 'react';
import styles from './financial-dropdown.module.css';

export default function FinancialDropDown({ category, details, selectedIndicators, handleCheckboxChange }) {
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 열리고 닫히는 상태관리

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (event) => {
    const { name, checked } = event.target;
    handleCheckboxChange(name, checked); // 체크된 값만 부모 컴포넌트에 전달
  };

  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdownHeader} onClick={toggleDropdown}>
        <span>{category || 'Select Option'}</span>
        <span className={isOpen ? styles.arrowUp : styles.arrowDown}>▼</span>
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {details && details.map((detail, index) => (
            <label key={index} className={styles.dropdownItem}>
              <input
                type="checkbox"
                name={detail}
                checked={selectedIndicators.includes(detail)} // 배열에 해당 항목이 있는지 확인
                onChange={handleChange}
              />
              {detail}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
