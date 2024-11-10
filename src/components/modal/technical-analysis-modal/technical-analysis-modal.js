// Modal.js
import React, { useState } from 'react';
import classes from './technical-analysis-modal.module.css';

export default function TechnicalAnalysisModal({ children, onClose }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className={classes.modalOverlay} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <div
        className={classes.modalContent}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div
          className={classes.modalHeader}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <button className={classes.closeButton} onClick={onClose} type="button">
            &times;
          </button>
        </div>
        <div className={classes.scrollContent}>{children}</div>
      </div>
    </div>
  );
}
