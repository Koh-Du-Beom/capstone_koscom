'use client';
import Link from "next/link";
import Image from "next/image";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import classes from './top-navbar.module.css';
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function TopNavBar() {
  const { isLoggedIn, login, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const res = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        login(data.user); 
      } else {
        logout();
        alert("로그인하지 않으면 이용이 불가능합니다.");
        router.push('/auth/login');
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
      router.push('/auth/login');

    } else {
      alert('로그아웃에 실패했습니다.');
    }
  };

  return (
    <Navbar style={{ backgroundColor: '#9DF1B3' }} sticky="top" expand="lg">
      <Container>
        <Navbar.Brand as={Link} href="/main" className="d-flex align-items-center text-white me-4" style={{ textDecoration: "none" }}>
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
            <Nav.Link as={Link} href="/main/stockFilter" className={`text ${classes.navbarLink}`}>종목필터</Nav.Link>
            <Nav.Link as={Link} href="/main/financeData" className={`text ${classes.navbarLink}`}>주식분석</Nav.Link>
            <Nav.Link as={Link} href="/main/backTesting" className={`text ${classes.navbarLink}`}>백테스트</Nav.Link>
            <Nav.Link as={Link} href="/main/portfolio" className={`text ${classes.navbarLink}`}>포트폴리오 추천</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <NavDropdown title="내 정보" id="basic-nav-dropdown" className={`text ${classes.navbarLink}`}>
              <NavDropdown.Item className={`text ${classes.navbarDropdownLink}`} href="/main/mypage">마이페이지</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className={`text ${classes.navbarDropdownLink}`} onClick={handleLogout}>
                로그아웃
              </NavDropdown.Item>
            </NavDropdown>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
