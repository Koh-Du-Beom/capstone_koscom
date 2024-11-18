import React, { forwardRef } from "react";
import { AiOutlineCalendar } from "react-icons/ai"; // 아이콘 사용을 위한 react-icons

const CustomCalendarIcon = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div
    onClick={onClick}
    ref={ref}
    style={{
      display: "flex",
      alignItems: "center",
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "10px",
      fontSize: "16px",
      cursor: "pointer",
    }}
  >
    <span style={{ flex: 1, textAlign: "center" }}>
      {value || placeholder}
    </span>
    <AiOutlineCalendar size={20} style={{ marginLeft: "8px" }} />
  </div>
));

export default CustomCalendarIcon;
