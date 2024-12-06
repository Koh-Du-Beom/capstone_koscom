'use client'; // 클라이언트 컴포넌트로 선언

import styles from './page.module.css';
import { useState, useRef } from 'react';
import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function PurchasePage({ params }) {
  const { portfolio_name } = params; // URL에서 포트폴리오 이름 가져오기
  const router = useRouter();
  const { email } = useAuthStore();
  const [agree, setAgree] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // 펼치기 여부 상태
  const termsRef = useRef(null); // 약관 textarea에 접근하기 위한 ref

  const handleFormSubmit = (e) => {
    e.preventDefault(); // 폼의 기본 동작 방지
    if (!agree) {
      alert('약관에 동의해야 구매가 가능합니다.');
      return;
    }

    // 서버로 요청 전송
    alert('구매 요청이 서버로 전송되었습니다!');
    // 요청을 서버에 전송하는 추가 로직 작성 가능 (예: fetch/axios 사용)
  };

  const spreadTerm = () => {
    if (termsRef.current) {
      if (isExpanded) {
        // 축소
        termsRef.current.style.height = '100px';
        setIsExpanded(false);
      } else {
        // 펼치기
        termsRef.current.style.height = '900px';
        setIsExpanded(true);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>포트폴리오 구매하기</h1>
      <form onSubmit={handleFormSubmit}>
        {/* 고객 정보 */}
        <section className={styles.section}>
          <h2>고객정보</h2>
          <div className={styles.inputGroup}>
            <label htmlFor="name">이름 *</label>
            <input type="text" id="name" name="name" placeholder="실명을 입력하세요" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">핸드폰 번호 *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="핸드폰 번호를 입력하세요. 예시) 010-1234-5678"
              pattern="[0-9]{10,11}"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">이메일 주소 *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@example.com"
              value={email}
              readOnly
            />
          </div>
        </section>

        {/* 결제 정보 */}
        <section className={styles.section}>
          <h2>결제정보</h2>
          <div className={styles.paymentInfo}>
            <span>포트폴리오 이름 : </span>
            <strong>{decodeURIComponent(portfolio_name)}</strong>
          </div>
          <div className={styles.paymentInfo}>
            <span>결제금액 : </span>
            <strong>₩10,000</strong>
          </div>
        </section>


        {/* 약관 동의 */}
        <section className={styles.section}>
          <h2>약관동의</h2>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="agree"
              name="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
            />
            <label htmlFor="agree">
              상품 약관에 동의합니다.{' '}
              <button type="button" onClick={spreadTerm} className={styles.spreadButton}>
                [{isExpanded ? '접기' : '펼치기'}]
              </button>
            </label>
          </div>
          <div
            ref={termsRef}
            className={`${styles.terms} ${isExpanded ? styles.expanded : ''}`}
          >
            <h3>제1조(목적)</h3>
            <p>
              본 약관은 사용자가 포트폴리오 구매 서비스를 이용함에 있어 필요한 권리, 의무 및 절차를
              규정함을 목적으로 합니다.
            </p>

            <h3>제2조(약관의 효력 및 변경)</h3>
            <p>
              ① 본 약관은 구매 서비스를 이용하는 모든 사용자에게 효력이 발생합니다.<br/>
              ② 본 약관은 포트폴리오 구매 페이지에 게시되며, 사용자가 동의함으로써 효력이 발생합니다. <br/>           
              ③ 회사는 약관을 변경할 수 있으며, 변경된 약관은 적용일자와 함께 공지됩니다. <br/>
              변경된 약관에 동의하지 않을 경우, 사용자는 구매 서비스를 중단할 수 있습니다. <br/>
            </p>
              
            <h3>제3조(용어의 정의)</h3>
            <p>
              ① "포트폴리오"란 사용자가 구매하는 투자 정보 또는 전략 자료를 의미합니다.
              <br />
              ② "사용자"란 구매 서비스를 이용하는 개인 또는 법인을 의미합니다.
              <br />
              ③ "구매 서비스"란 사용자가 포트폴리오를 선택하고 결제하는 과정을 포함한 서비스를
              의미합니다.
            </p>
            
            <h3>제4조(구매 서비스 이용)</h3>
            <p>
              ① 사용자는 구매 페이지에서 제공하는 정보를 정확히 입력해야 하며, 잘못된 정보로 인해 발생하는 문제에 대해서는 책임을 지지 않습니다.
              <br/>
              ② 사용자는 구매 완료 후 제공된 포트폴리오 정보를 개인적 용도로만 사용해야 하며, 제3자에게 무단으로 공유하거나 판매할 수 없습니다.
              <br/>
            </p>

            <h3>제5조(결제)</h3>
            <p>
              ① 구매 금액은 결제 페이지에 명시된 금액으로 합니다. <br/>
              ② 결제 완료 후 제공된 포트폴리오는 환불이 불가합니다. 단, 서비스 제공에 오류가 있는 경우, 회사는 환불 또는 수정된 자료를 제공합니다. <br/>
              ③ 사용자는 결제 과정에서 안전한 정보를 제공해야 하며, 결제 정보 유출로 인한 문제에 대해서는 회사가 책임지지 않습니다. <br/>
            </p>

            <h3>제6조(약관 동의)</h3>
            <p>
              사용자는 본 약관에 동의해야 구매가 가능하며, 동의하지 않을 경우 구매가 제한될 수 있습니다.<br/>
            </p>

            <h3>제7조(기타)</h3>
            <p>
              ① 회사는 서비스를 개선하기 위해 일정 기간 서비스 제공을 중단하거나, 약관의 내용을 변경할 수 있습니다.<br/>
              ② 사용자는 구매 전 반드시 약관의 내용을 확인해야 하며, 이를 확인하지 않아 발생하는 문제에 대해서는 책임을 지지 않습니다.<br/>
            </p>

            <h3>부칙</h3>
            <p>본 약관은 2024년 12월 9일부터 시행됩니다.</p>
          </div>
        </section>


        {/* 버튼 */}
        <div className={styles.buttonGroup}>
          <button type="button" className={styles.cancelButton} onClick={() => {router.push('/main/portfolio')}}>
            취소
          </button>
          <button type="submit" className={styles.purchaseButton}>
            구매하기
          </button>
        </div>
      </form>
    </div>
  );
}
