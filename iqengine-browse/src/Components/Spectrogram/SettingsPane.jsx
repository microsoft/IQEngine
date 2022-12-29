// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

class SettingsPane extends Component {

  constructor(props) {
    super(props);
    this.state = {
      size: 1024,
      magnitudeMax: 255,
      magnitudeMin: 30,
      taps: "[" + new Float32Array(1).fill(1).toString() + "]",
    };
  }

  onChangeMagnitudeMax = (event) => {
    this.setState({
      magnitudeMax: event.target.value
    });
  };

  onChangeMagnitudeMin = (event) => {
    this.setState({
      magnitudeMin: event.target.value
    });
  };


  onChangeFftsize = (event) => {
    this.setState({
      size: event.target.value
    });
  };

  onChangeTaps = (event) => {
    this.setState({
      taps: event.target.value
    });
  };


  onSubmitTaps = () => {
    let taps = new Array(1).fill(1);
    // make sure the string is a valid array
    var taps_string = this.state.taps;
    if (taps_string[0] === '[' && taps_string.slice(-1) === ']') {
      taps = taps_string.slice(1, -1).split(',');
      taps = taps.map((x) => parseFloat(x));
      taps = Float32Array.from(taps);
      this.props.updateBlobTaps(taps);
      console.log('valid taps, found', taps.length, 'taps');
    } else {
      console.error('invalid taps');
    }
    this.props.updateBlobTaps(taps);
  };

  render() {

    const { handleFftSize, handleMagnitudeMax, handleMagnitudeMin } = this.props;
    const { size, taps, magnitudeMax, magnitudeMin } = this.state;

    return (
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Magnitude Max</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control type="text" defaultValue={magnitudeMax} onChange={this.onChangeMagnitudeMax} size="sm" />
            <Button className="btn btn-secondary" onClick={handleMagnitudeMax}>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Magnitude Min</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control type="text" defaultValue={magnitudeMin} onChange={this.onChangeMagnitudeMin} size="sm" />
            <Button className="btn btn-secondary" onClick={handleMagnitudeMin}>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>FFT Size</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control type="text" defaultValue={size} onChange={this.onChangeFftsize} size="sm" />
            <Button className="btn btn-secondary" onClick={handleFftSize}>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>FIR Filter Taps</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control type="text" defaultValue={taps} onChange={this.onChangeTaps} size="sm" />
            <Button className="btn btn-secondary" onClick={this.onSubmitTaps}>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </InputGroup>
        </Form.Group>

        <DropdownButton title="Data Type" id="dropdown-menu-align-right" onSelect>
          <Dropdown.Item eventKey="cf32_le">complex float32</Dropdown.Item>
          <Dropdown.Item eventKey="ci16_le">complex int16</Dropdown.Item>
        </DropdownButton>
        <p></p>
      </Form>
    );
  }
}

export default SettingsPane
