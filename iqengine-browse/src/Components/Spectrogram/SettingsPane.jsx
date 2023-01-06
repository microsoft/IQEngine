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
      taps: '[' + new Float32Array(1).fill(1).toString() + ']',
      windowFunction: 'hamming',
    };
  }

  onChangeMagnitudeMax = (event) => {
    this.setState({
      magnitudeMax: event.target.value,
    });
  };

  onChangeWindowFunction = (event) => {
    this.setState({
      windowFunction: event,
    });
    this.props.updateWindowChange(event);
  };

  onSubmitMagnitudeMax = () => {
    this.props.updateMagnitudeMax(this.state.magnitudeMax);
  };

  onChangeMagnitudeMin = (event) => {
    this.setState({
      magnitudeMin: event.target.value,
    });
  };

  onSubmitMagnitudeMin = () => {
    this.props.updateMagnitudeMin(this.state.magnitudeMin);
  };

  onChangeFftsize = (event) => {
    this.setState({
      size: event.target.value,
    });
  };

  onSubmitFftsize = () => {
    this.props.updateFftsize(this.state.size);
  };

  onChangeTaps = (event) => {
    this.setState({
      taps: event.target.value,
    });
  };

  onSubmitTaps = () => {
    let taps = new Array(1).fill(1);
    // make sure the string is a valid array
    let taps_string = this.state.taps;
    if (taps_string[0] === '[' && taps_string.slice(-1) === ']') {
      taps = taps_string.slice(1, -1).split(',');
      taps = taps.map((x) => parseFloat(x));
      taps = Float32Array.from(taps);
      this.props.updateBlobTaps(taps);
      console.log('valid taps, found', taps.length, 'taps');
    } else {
      console.error('invalid taps');
    }
    //this.props.updateBlobTaps(taps);
  };

  render() {
    const { size, taps, magnitudeMax, magnitudeMin, windowFunction } = this.state;

    return (
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Magnitude Max</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control type="text" defaultValue={magnitudeMax} onChange={this.onChangeMagnitudeMax} size="sm" />
            <Button className="btn btn-secondary" onClick={this.onSubmitMagnitudeMax}>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Magnitude Min</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control type="text" defaultValue={magnitudeMin} onChange={this.onChangeMagnitudeMin} size="sm" />
            <Button className="btn btn-secondary" onClick={this.onSubmitMagnitudeMin}>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>FFT Size</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control type="text" defaultValue={size} onChange={this.onChangeFftsize} size="sm" />
            <Button className="btn btn-secondary" onClick={this.onSubmitFftsize}>
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

        <DropdownButton title="Data Type" variant="secondary" className="mb-3" id="dropdown-menu-align-right" onSelect>
          <Dropdown.Item eventKey="cf32_le">complex float32</Dropdown.Item>
          <Dropdown.Item eventKey="ci16_le">complex int16</Dropdown.Item>
        </DropdownButton>

        <DropdownButton title="Window" variant="secondary" className="mb-3" id="dropdown-menu-align-right" onSelect={this.onChangeWindowFunction}>
          <Dropdown.Item active={windowFunction === 'hamming'} eventKey="hamming">
            Hamming
          </Dropdown.Item>
          <Dropdown.Item active={windowFunction === 'none'} eventKey="none">
            None
          </Dropdown.Item>
        </DropdownButton>
        <p></p>
      </Form>
    );
  }
}

export default SettingsPane;
