'use client'
import React from 'react';
import FinancialDropdown from './financial-dropdown';
import dropdownData from './financial-dropdown-data';

export default function FinancialDropdownGroup() {
  return (
    <div>
      {dropdownData.map((data, index) => (
        <FinancialDropdown key={index} category={data.category} details={data.details} />
      ))}
    </div>
  );
}
