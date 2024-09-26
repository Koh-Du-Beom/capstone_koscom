'use client'
import React, { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';

export default function FinancialDropDown() {
	const [checkedItems, setCheckedItems] = useState({
    option1: false,
    option2: false,
    option3: false,
  });

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
        Select Options
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Form>
          <Form.Check
            type="checkbox"
            label="Option 1"
            name="option1"
            checked={checkedItems.option1}
            onChange={handleCheckboxChange}
            className="dropdown-item"
          />
          <Form.Check
            type="checkbox"
            label="Option 2"
            name="option2"
            checked={checkedItems.option2}
            onChange={handleCheckboxChange}
            className="dropdown-item"
          />
          <Form.Check
            type="checkbox"
            label="Option 3"
            name="option3"
            checked={checkedItems.option3}
            onChange={handleCheckboxChange}
            className="dropdown-item"
          />
        </Form>
      </Dropdown.Menu>
    </Dropdown>
	)
};
