import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Col, Button } from 'react-bootstrap';

const RepositoryTile = (props) => {
  const { name, accountName, containerName, imageURL, description, sasToken } = props.item;
  const expires = sasToken.slice(sasToken.search('se')).split('&')[0].slice(3, 13); // YEAR-MONTH-DAY
  // const writeable1 = sasToken1.slice(sasToken1.search('sp')).split('&')[0].includes('w'); // boolean

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
        <Col md="8">
          <Card>
            <Card.Body style={styleCenter}>
              <Card.Img variant="top" src={imageURL} style={styleHeight}></Card.Img>
              <center>
                <Card.Title>{name}</Card.Title>
              </center>
              <Card.Text style={styleObj}>Account Name: {accountName}</Card.Text>
              <Card.Text style={styleObj}>Container Name: {containerName}</Card.Text>
              <Card.Text style={styleObj}>{description}</Card.Text>
              <Card.Text style={styleObj}>SAS Token expiration: {expires}</Card.Text>
            </Card.Body>
            <Button variant="success">Browse</Button>
          </Card>
        </Col>
      </Container>
    </div>
  );
};

export default RepositoryTile;
