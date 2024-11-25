'use client'
import { useState } from 'react';
import classes from './page.module.css';
import logo from '../../../public/images/SuperFantastic.png';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

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
      alert('로그인에 성공하셨습니다');
      router.push('/');
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
        <button type="submit" className={classes.button}>로그인</button>
        <div className={classes.links}>
          <a href="#">비밀번호 찾기</a> | <a href="#">아이디 찾기</a> | <Link href="/signup">회원가입</Link>
        </div>
      </form>
    </div>
  );
}
