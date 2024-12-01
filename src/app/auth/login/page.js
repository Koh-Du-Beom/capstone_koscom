'use client';
import { useState } from 'react';
import classes from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키를 포함하여 요청
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      await login(data.user); // 로그인 및 관심 종목 가져오기
      redirect('/main');
    } else {
      const data = await res.json();
      alert(data.message);
    }
  };

  return (
    <div className={classes.container}>
      {/* 상단 로고와 텍스트 */}
      <div className={classes.logoContainer}>
        <Image
          src='/images/SuperFantastic.png'
          alt="SuperFantastic Logo"
          className={classes.logoImage}
          priority
          width={100}
          height={100}
        />
        <h1 className={classes.logoText}>SuperFantastic</h1>
      </div>

      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.inputGroup}>
          <input
            type="text"
            placeholder="아이디 또는 전화번호"
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
        <div className={classes.options}>
          <label>
            <input type="checkbox" />
            로그인 상태 유지
          </label>
        </div>
        <button type="submit" className={classes.button}>
          로그인
        </button>
        <div className={classes.links}>
          <a>비밀번호 찾기</a> | <a>아이디 찾기</a> |{' '}
          <Link href="/auth/signup">회원가입</Link>
        </div>
      </form>
    </div>
  );
}
