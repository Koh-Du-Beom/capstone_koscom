'use client';
import Link from "next/link";
import Image from "next/image";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import classes from './no-login-top-navbar.module.css'

export default function NoLoginTopNavBar() {

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
            <Nav.Link as={Link} href="/no-login/stockFilter" className={`text ${classes.navbarLink}`}>종목필터</Nav.Link>
            <Nav.Link as={Link} href="/no-login/financeData" className={`text ${classes.navbarLink}`}>주식분석</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link as={Link} href="/auth/login" className={`text ${classes.navbarLink}`}>로그인</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
