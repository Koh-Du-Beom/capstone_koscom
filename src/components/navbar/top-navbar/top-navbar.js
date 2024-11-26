// src/components/navbar/top-navbar/top-navbar.js
'use client';
import Link from "next/link";
import Image from "next/image"; // Image 모듈 가져오기
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import classes from './top-navbar.module.css';

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function TopNavBar() {
  const { isLoggedIn, login, logout } = useAuthStore();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const res = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        login(data.user); // 유저 데이터를 저장
      } else {
        logout();
      }
    };

    checkLoginStatus();
  }, [login, logout]);

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      logout();
    }
  };

  return (
    <Navbar style={{ backgroundColor: '#9DF1B3' }} sticky="top" expand="lg">
      <Container>
        <Navbar.Brand as={Link} href="/" className="d-flex align-items-center text-white me-4" style={{ textDecoration: "none" }}>
          <Image
            src="/images/SuperFantastic.png" 
            alt="SuperFantastic Logo"
            width={40} 
            height={40} 
            className={classes.circularImage}
            priority 
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/stockFilter" className={`text ${classes.navbarLink}`}>종목필터</Nav.Link>
            <Nav.Link as={Link} href="/financeData" className={`text ${classes.navbarLink}`}>주식분석</Nav.Link>
            <Nav.Link as={Link} href="/backTesting" className={`text ${classes.navbarLink}`}>백테스트</Nav.Link>
            <Nav.Link as={Link} href="/portfolio" className={`text ${classes.navbarLink}`}>포트폴리오 추천</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <>
                <Nav.Link className={`text ${classes.navbarLink}`} href="/mypage">마이페이지</Nav.Link>
                <Nav.Link className={`text ${classes.navbarLink}`} onClick={handleLogout}>로그아웃</Nav.Link>
              </>
            ) : (
              <Nav.Link href="/login" className={`text ${classes.navbarLink}`}>로그인</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
