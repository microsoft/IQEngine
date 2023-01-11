import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Col, Button } from 'react-bootstrap';

const RepositoryTile = () => {
  return (
    <div className="App">
      <Container className="p-4">
        <Col md="12">
          <Card>
            <Card.Body>
              <Card.Img variant="top" src="public/favicon.ico"></Card.Img>
              <Card.Text>THUMBNAIL</Card.Text>
              <Card.Title>NAME</Card.Title>
              <Card.Text>DESCRIPTION DESCRIPTION DESCRIPTION</Card.Text>
              <Button variant="primary">GO</Button>
            </Card.Body>
          </Card>
        </Col>
      </Container>
    </div>
  );
};

export default RepositoryTile;
