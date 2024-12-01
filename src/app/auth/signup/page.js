'use client';
import { useState } from 'react';
import classes from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword){
      alert('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert('회원가입이 완료되었습니다.');
      redirect('/auth/login');
    } else {
      const data = await res.json();
      alert(data.message);
    }
  };

  return (
    <div className={classes.container}>
      <Link className={classes.logoContainer} href={'/'}>
        <Image
          src='/images/SuperFantastic.png'
          alt="SuperFantastic Logo" 
          className={classes.logoImage} 
          priority
          width={100}
          height={100}
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
          <Link href="/auth/login">이미 계정이 있으신가요?</Link>
        </div>
      </form>
    </div>
  );
}
