'use client';

import React, { useState } from 'react';
import useAuthStore from '@/store/authStore'; // zustand store import
import classes from './page.module.css';
import DetailBox from '@/components/portfolio/details/detail-box';
import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import MyInfo from '@/components/my-info/my-info';

export default function MyPage() {
  const { email } = useAuthStore(); // zustand에서 email 가져오기
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');


  return (
    <div className={classes.container}>
      

      <MyInfo />
      
      <div className={classes.contents}>
        <h3 className={classes.subHeading}>나의 포트폴리오</h3>
        {/* 나중에 map함수로 받아온 포트폴리오 데이터 보여주기 */}
        <DetailBox />
        <DetailBox />
        <DetailBox />
      </div>
      
      
    </div>
  );
}
