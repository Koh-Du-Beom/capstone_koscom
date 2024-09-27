'use client'
import React, { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';

export default function FinancialDropDown({ category, details }) {
	const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

	return (
		<Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        {category || 'Select Option'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Form>
          {details && details.map((detail, index) => (
            <Form.Check
              key={index}
              type="checkbox"
              label={detail}
              name={detail}
              checked={checkedItems[detail] || false}
              onChange={handleCheckboxChange}
              className="dropdown-item"
            />
          ))}
        </Form>
      </Dropdown.Menu>
    </Dropdown>
	)
};
