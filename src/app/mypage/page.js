'use client';

import React, { useState } from 'react';
import useAuthStore from '@/store/authStore'; // zustand store import
import classes from './page.module.css';

export default function MyPage() {
  const { email } = useAuthStore(); // zustand에서 email 가져오기
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');


  return (
    <div className={classes.container}>
      <h1>마이페이지</h1>

      <div className={classes.info}>
        <p><strong>아이디:</strong> {email}</p>
      </div>

      
    </div>
  );
}
