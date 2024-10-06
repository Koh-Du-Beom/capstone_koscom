import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function GraphLayout({ graphs }) {
  return (
    <Container>
      <Row>
        {graphs.map((graph, index) => (
          <Col xs={12} md={6} key={index}>
            {graph}
          </Col>
        ))}
      </Row>
    </Container>
  );
}
