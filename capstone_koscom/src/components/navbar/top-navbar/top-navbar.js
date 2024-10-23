'use client'
import Link from "next/link"

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import classes from './top-navbar.module.css';

export default function TopNavBar() {
  return (
    <Navbar expand="lg" className='bg-primary' sticky="top">
      <Container>
        <Navbar.Brand as={Link} href="/" style={{textDecoration: "none"}} className="text-white">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />
        <Navbar.Collapse id="basic-navbar-nav"> 
          <Nav className="mx-auto">
						<Nav.Link as={Link} href="/financeData" className={`text-white ${classes.navbarLink}`}>주식분석</Nav.Link> 
						<Nav.Link as={Link} href="/backTesting" className={`text-white ${classes.navbarLink}`}>백테스트</Nav.Link> 
						<Nav.Link as={Link} href="/portfolio" className={`text-white ${classes.navbarLink}`}>포트폴리오 추천</Nav.Link>
					</Nav>
          <Nav className="ms-auto">
            <Button variant="outline-light">Login</Button> 
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
