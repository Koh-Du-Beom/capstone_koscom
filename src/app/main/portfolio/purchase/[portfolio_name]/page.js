'use client'; // 클라이언트 컴포넌트 선언

import { useRouter } from 'next/navigation';

export default function PurchasePage({ params }) {
  const router = useRouter();
  const { portfolio_name } = params;

  const handlePurchase = () => {
    alert(`"${portfolio_name}" 구매 완료!`);
    // 추가 로직 필요 시 여기에 작성
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>구매 페이지</h1>
      <p>
        <strong>"{portfolio_name}"</strong> 포트폴리오를 구매하시겠습니까?
      </p>
      <button onClick={handlePurchase}>구매하기</button>
    </div>
  );
}
