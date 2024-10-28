import React, { useState } from 'react';
import classes from './back-testing-dropdown.module.css';

export default function BackTestingDropdown({ options, targetKey, updateParentObject }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(''); // 선택된 옵션을 저장하는 state

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option); // 선택된 옵션을 업데이트
    updateParentObject(targetKey, option);
    setIsOpen(false); 
  };

  return (
    <div className={classes.dropdownContainer}>
      <div className={classes.dropdownHeader} onClick={toggleDropdown}>
        <span>{selectedOption || '원하는 옵션을 선택해주세요'}</span> {/* 선택된 옵션 표시 */}
        <span className={isOpen ? classes.arrowUp : classes.arrowDown}>▼</span>
      </div>

      {isOpen && (
        <div className={classes.dropdownMenu}>
          {options && options.map((option, index) => (
            <div
              key={index}
              className={classes.dropdownItem}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
