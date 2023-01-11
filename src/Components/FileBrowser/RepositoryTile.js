import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Col, Button } from 'react-bootstrap';

const RepositoryTile = (props) => {
  const styleHeight = {
    width: 300,
    height: 300,
  };

  const styleObj = {
    fontSize: 14,
  };

  const styleCenter = {
    marginRight: 'auto',
    marginLeft: 'auto',
  };

  return (
    <div className="App">
      <Container className="p-4">
        <Col md="9">
          <Card>
            <Card.Body style={styleCenter}>
              <Card.Img variant="top" src={props.imgUrl} style={styleHeight}></Card.Img>
              <center>
                <Card.Title>{props.name}</Card.Title>
              </center>
              <Card.Text style={styleObj}>Account Name: {props.accountName}</Card.Text>
              <Card.Text style={styleObj}>Container Name: {props.containerName}</Card.Text>
              <Card.Text style={styleObj}>{props.description}</Card.Text>
              <Card.Text style={styleObj}>SAS Token expiration: {props.expires}</Card.Text>
            </Card.Body>
            <Button variant="success">Browse</Button>
          </Card>
        </Col>
      </Container>
    </div>
  );
};

// JSON.stringify()

export default RepositoryTile;
