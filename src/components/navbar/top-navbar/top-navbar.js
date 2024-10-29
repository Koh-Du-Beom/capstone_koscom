// src/components/navbar/top-navbar/top-navbar.js
'use client';
import Link from "next/link";
import Image from "next/image"; // Image 모듈 가져오기

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import classes from './top-navbar.module.css';

export default function TopNavBar() {
  return (
    <Navbar style={{ backgroundColor: '#9DF1B3' }} sticky="top">
      <Container>
        {/* Image 컴포넌트를 사용하여 아이콘 추가 */}
        <Navbar.Brand as={Link} href="/" className="d-flex align-items-center text-white me-4" style={{ textDecoration: "none" }}>
          <Image
            src="/images/SuperFantastic.png" // public 폴더 하위 경로만 입력
            alt="SuperFantastic Logo"
            width={40} // 원하는 너비로 설정
            height={40} // 원하는 높이로 설정
            className={classes.circularImage} // 원형 스타일 적용
            priority // 로고 등 중요한 이미지는 우선 로딩
          />
          {/* <span className="ms-2">SuperFantastic</span> */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={Link} href="/financeData" className={`text ${classes.navbarLink}`}>주식분석</Nav.Link>
            <Nav.Link as={Link} href="/backTesting" className={`text ${classes.navbarLink}`}>백테스트</Nav.Link>
            <Nav.Link as={Link} href="/portfolio" className={`text ${classes.navbarLink}`}>포트폴리오 추천</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
