'use client';

import { useState } from 'react';
import Image from 'next/image';
import classes from './detail-toolbar.module.css';
import TableTooltip from '@/components/technical-analysis/technical-table/table-tooltip';

export default function DetailToolbar({ title , isExpanded, toggleDetail }) {
  const [tooltip, setTooltip] = useState({ visible: false, content: '', position: { top: 0, left: 0 } });

  const showTooltip = (content, event) => {
    const rect = event.target.getBoundingClientRect();
    setTooltip({
      visible: true,
      content,
      position: {
        top: rect.top - 10,
        left: rect.left + rect.width / 2,
      },
    });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, content: '', position: { top: 0, left: 0 } });
  };

  return (
    <div className={classes.toolbar}>
      <h2 className={classes.portfolio_title}>{title}</h2>
      <section className={classes.button_container}>
        <button
          className={classes.button}
          onClick={toggleDetail}
          onMouseEnter={(event) => showTooltip(isExpanded ? '포트폴리오 닫기' : '포트폴리오 열기', event)}
          onMouseLeave={hideTooltip}
        >
          <Image
            src={`/svgs/${isExpanded ? 'shrinkIcon' : 'enlargeIcon'}.svg`}
            alt="Enlarge"
            width={24}
            height={24}
          />
        </button>
        <button
          className={classes.button}
          onMouseEnter={(event) => showTooltip('포트폴리오 삭제', event)}
          onMouseLeave={hideTooltip}
        >
          <Image
            src="/svgs/closeIcon.svg"
            alt="Close"
            width={24}
            height={24}
          />
        </button>
      </section>

      {/* 툴팁 렌더링 */}
      {tooltip.visible && (
        <TableTooltip content={tooltip.content} position={tooltip.position} />
      )}
    </div>
  );
}
