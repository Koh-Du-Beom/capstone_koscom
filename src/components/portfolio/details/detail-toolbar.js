'use client';

import { useState } from 'react';
import Image from 'next/image';
import classes from './detail-toolbar.module.css';
import TableTooltip from '@/components/technical-analysis/technical-table/table-tooltip';
import useAuthStore from '@/store/authStore';

export default function DetailToolbar({ title, isExpanded, toggleDetail, onDeleteSuccess }) {
  const [tooltip, setTooltip] = useState({ visible: false, content: '', position: { top: 0, left: 0 } });
  const { email } = useAuthStore();

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

  const handleDelete = async () => {
    if (!email) {
      alert('로그인이 필요합니다.');
      return;
    }

    const confirmDelete = confirm('정말 이 포트폴리오를 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const response = await fetch('/api/portfolio', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, title }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        if (onDeleteSuccess) onDeleteSuccess(); // 성공 시 부모 컴포넌트에 알림
      } else {
        alert(result.error || '포트폴리오 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      alert('서버 에러가 발생했습니다.');
    }
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
          onClick={handleDelete}
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
