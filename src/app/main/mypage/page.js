'use client'
import React, { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';
import ComponentLoading from '@/components/loading/component-loading';
import classes from './page.module.css';
import DetailBox from '@/components/portfolio/details/detail-box';
import MyInfo from '@/components/my-info/my-info';

export default function MyPage() {
  const { email } = useAuthStore(); // zustand에서 email 가져오기
  const [myPortfolio, setMyPortfolio] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    if (email) {
      // 이메일을 기준으로 포트폴리오 데이터를 가져오기
      fetch(`/api/portfolio?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setMessage(data.error);
          } else if (data.message) {
            setMessage(data.message);
          } else {
            setMyPortfolio(data);
          }
        })
        .catch((error) => {
          console.error('Error fetching portfolio:', error);
          setMessage('포트폴리오를 가져오는 중 오류가 발생했습니다.');
        })
        .finally(() => {
          setIsLoading(false); // 로딩 완료
        });
    }
  }, [email]);

  if (isLoading) {
    return <ComponentLoading />; // 로딩 상태 표시
  }

  return (
    <div className={classes.container}>
      <MyInfo />
      <div className={classes.contents}>
        <h3 className={classes.subHeading}>나의 포트폴리오</h3>
        {message && <p>{message}</p>}
        {myPortfolio.length > 0 ? (
          myPortfolio.map((portfolio) => (
            <DetailBox key={portfolio.id} data={portfolio} /> // 포트폴리오 데이터 전달
          ))
        ) : (
          <p>포트폴리오가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
