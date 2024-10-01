import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';


export default function GridLayout( { graphs }) {
	return (
    <Container>
      <Row>
        {items.map((item, index) => (
          <Col xs={12} md={6} key={index}>
            {item}
          </Col>
        ))}
      </Row>
    </Container>
	)
};
