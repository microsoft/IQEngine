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
      error: { magMax: '', magMin: '', size: '' }, // holds error string for each input
    };
  }

  onChangeWindowFunction = (event) => {
    this.setState({
      windowFunction: event,
    });
    this.props.updateWindowChange(event);
  };

  onChangeMagnitudeMax = (event) => {
    this.setState({
      magnitudeMax: parseInt(event.target.value),
    });
  };

  onSubmitMagnitudeMax = () => {
    const { magnitudeMax, error, magnitudeMin } = this.state;
    if (parseInt(magnitudeMax) && magnitudeMax > magnitudeMin && magnitudeMax < 256) {
      this.props.updateMagnitudeMax(magnitudeMax);
      this.setState({
        error: {
          ...error,
          magMax: '',
        },
      });
    } else {
      this.setState({
        error: {
          ...error,
          magMax: 'Magnitude max must be an integer, greater than the magnitude min, and between 1 and 255',
        },
      });
    }
  };

  onChangeMagnitudeMin = (event) => {
    this.setState({
      magnitudeMin: parseInt(event.target.value),
    });
  };

  onSubmitMagnitudeMin = () => {
    const { magnitudeMin, error, magnitudeMax } = this.state;
    const min = parseInt(magnitudeMin);
    const max = parseInt(magnitudeMax);
    if (min && min >= 0 && min < max) {
      this.props.updateMagnitudeMin(magnitudeMin);
      this.setState({
        error: {
          ...error,
          magMin: '',
        },
      });
    } else {
      this.setState({
        error: {
          ...error,
          magMin: 'Magnitude min must be an integer, less than the magnitude max, and between 1 and 255',
        },
      });
    }
  };

  onChangeFftsize = (event) => {
    this.setState({
      size: parseInt(event.target.value),
    });
  };

  onSubmitFftsize = () => {
    const { size, error } = this.state;
    const intSize = parseInt(size);
    if (intSize >= 64 && Math.sqrt(intSize) % 2 === 0) {
      this.props.updateFftsize(this.state.size);
      this.setState({
        error: {
          ...error,
          size: '',
        },
      });
    } else {
      this.setState({
        error: {
          ...error,
          size: 'Size must be a power of 2 and at least 64',
        },
      });
    }
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
    const { size, taps, magnitudeMax, magnitudeMin, windowFunction, error } = this.state;
    return (
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Magnitude Max</Form.Label>
          <div style={{ color: 'red', marginBottom: '2px' }}>{error.magMax}</div>
          <InputGroup className="mb-3">
            <Form.Control type="text" defaultValue={magnitudeMax} onChange={this.onChangeMagnitudeMax} size="sm" />
            <Button className="btn btn-secondary" onClick={this.onSubmitMagnitudeMax}>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Magnitude Min</Form.Label>
          <div style={{ color: 'red', marginBottom: '2px' }}>{error.magMin}</div>
          <InputGroup className="mb-3">
            <Form.Control type="text" defaultValue={magnitudeMin} onChange={this.onChangeMagnitudeMin} size="sm" />
            <Button className="btn btn-secondary" onClick={this.onSubmitMagnitudeMin}>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>FFT Size</Form.Label>
          <div style={{ color: 'red', marginBottom: '2px' }}>{error.size}</div>
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
          <Dropdown.Item active={windowFunction === 'rectangle'} eventKey="rectangle">
            Rectangle
          </Dropdown.Item>
          <Dropdown.Item active={windowFunction === 'hanning'} eventKey="hanning">
            Hanning
          </Dropdown.Item>
          <Dropdown.Item active={windowFunction === 'barlett'} eventKey="barlett">
            Barlett
          </Dropdown.Item>
          <Dropdown.Item active={windowFunction === 'blackman'} eventKey="blackman">
            Blackman
          </Dropdown.Item>
        </DropdownButton>
        <p></p>
      </Form>
    );
  }
}

export default SettingsPane;
