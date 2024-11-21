'use client';
import { useState } from 'react';
import classes from './page.module.css';
import logo from '../../../public/images/SuperFantastic.png';
import Image from 'next/image';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert('회원가입이 완료되었습니다!');
      window.location.href = '/login';
    } else {
      const data = await res.json();
      alert(data.message);
    }
  };

  return (
    <div className={classes.container}>
      {/* 상단 로고와 텍스트 */}
      <Link className={classes.logoContainer} href={'/'}>
        <Image
          src={logo} 
          alt="SuperFantastic Logo" 
          className={classes.logoImage} 
          priority
        />
        <h1 className={classes.logoText}>SuperFantastic</h1>
      </Link>

      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.inputGroup}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={classes.input}
          />
        </div>
        <div className={classes.inputGroup}>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={classes.input}
          />
        </div>
        <div className={classes.inputGroup}>
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={classes.input}
          />
        </div>
        <button type="submit" className={classes.button}>회원가입</button>
        <div className={classes.links}>
          <Link href="/login">이미 계정이 있으신가요? 로그인</Link>
        </div>
      </form>
    </div>
  );
}
