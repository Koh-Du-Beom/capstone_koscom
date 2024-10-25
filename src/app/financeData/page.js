'use client';
import React, { useState, useEffect } from 'react';
import FinancialDropdown from '@/components/graphs/financial-data/dropdown/financial-dropdown';
import classes from './page.module.css';
import FinancialGraph from '@/components/graphs/financial-graph';
import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import dropdownData from '@/components/graphs/financial-data/dropdown/financial-dropdown-data';
import SelectedStock from '@/components/graphs/selected-stock';
import FinancialPrompt from '@/components/graphs/financial-data/prompt/financial-prompt';

export default function FinancialDataShowPage() {
  const [selectedOption, setSelectedOption] = useState('dropdown');
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]); 
  const [graphData, setGraphData] = useState([]);

  const handleCheckboxChange = (name, checked) => {
    if (checked) {
      setCheckedItems((prevItems) => [...prevItems, name]);
    } else {
      setCheckedItems((prevItems) => prevItems.filter(item => item !== name));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getGraphData-checkBox', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ selectedStocks, checkedItems }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setGraphData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (checkedItems.length > 0 && selectedStocks.length > 0) {
      fetchData();
    }
  }, [checkedItems, selectedStocks]);

  const handleOptionClick = (option) => {
    setSelectedOption(option); 
  };

  const handleSelectStock = (stocks) => {
    setSelectedStocks(Array.isArray(stocks) ? stocks : [stocks]);
  };

	const updateGraphDataWithPrompt = (newData) => {
    setGraphData(newData);
  };

  return (
    <div className={classes.container}>
      <div className={classes.leftSection}>
        <div className={classes.selectionSection}>
          <h2 className={classes.title}>주식 분석</h2>
          <button
            className={`${classes.button} ${selectedOption === 'dropdown' ? classes.activeButton : ''}`}
            onClick={() => handleOptionClick('dropdown')}
          >
            Dropdown
          </button>
          <button
            className={`${classes.button} ${selectedOption === 'prompt' ? classes.activeButton : ''}`}
            onClick={() => handleOptionClick('prompt')}
          >
            Prompt
          </button>
        </div>

        <div className={classes.inputSection}>
					<SelectedStock onSelectStock={handleSelectStock} />
          {selectedOption === 'dropdown' ? (
            dropdownData.map((data, index) => (
              <FinancialDropdown
                key={index}
                category={data.category}
                details={data.details}
                checkedItems={checkedItems}
                handleCheckboxChange={handleCheckboxChange}
              />
            ))
          ) : (
            <FinancialPrompt />
          )}
        </div>
      </div>

      <div className={classes.rightSection}>      
        <div className={classes.graphSection}>
          <FinancialGraph graphData={graphData} />
        </div>
      </div>
    </div>
  );
}
