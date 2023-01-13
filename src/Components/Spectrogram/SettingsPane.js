// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

const SettingsPane = (props) => {
  const [state, setState] = useState({
    size: 1024,
    taps: '[1]',
    windowFunction: 'hamming',
    error: { magMax: '', magMin: '', size: '' },
  });

  let [magnitudeMax, onChangeMagnitudeMax] = useState({ magnitudeMax: props.magnitudeMax });
  let [magnitudeMin, onChangeMagnitudeMin] = useState({ magnitudeMin: props.magnitudeMin });

  useEffect(() => {
    onChangeMagnitudeMax({ magnitudeMax: props.magnitudeMax });
  }, [props.magnitudeMax]);

  useEffect(() => {
    onChangeMagnitudeMin({ magnitudeMin: props.magnitudeMin });
  }, [props.magnitudeMin]);

  const onChangeWindowFunction = (event) => {
    setState({ ...state, windowFunction: event });
    props.updateWindowChange(event);
  };

  const onChangeTargetMagnitudeMax = (event) => {
    onChangeMagnitudeMax({ magnitudeMax: parseInt(event.target.value) });
  };

  const onSubmitMagnitudeMax = () => {
    const min = parseInt(magnitudeMin.magnitudeMin);
    const max = parseInt(magnitudeMax.magnitudeMax);
    if (parseInt(max) && max > min && max < 256) {
      props.updateMagnitudeMax(max);
      setState({
        ...state,
        error: {
          ...state.error,
          magMax: '',
        },
      });
    } else {
      setState({
        ...state,
        error: {
          ...state.error,
          magMax: 'Magnitude max must be an integer, greater than the magnitude min, and between 1 and 255',
        },
      });
    }
  };

  const onChangeTargetMagnitudeMin = (event) => {
    onChangeMagnitudeMin({ magnitudeMin: parseInt(event.target.value) });
  };

  const onSubmitMagnitudeMin = () => {
    const min = parseInt(magnitudeMin.magnitudeMin);
    const max = parseInt(magnitudeMax.magnitudeMax);
    if (min && min >= 0 && min < max) {
      props.updateMagnitudeMin(magnitudeMin.magnitudeMin);
      setState({
        ...state,
        error: {
          ...state.error,
          magMin: '',
        },
      });
    } else {
      setState({
        ...state,
        error: {
          ...state.error,
          magMin: 'Magnitude min must be an integer, less than the magnitude max, and between 1 and 255',
        },
      });
    }
  };

  const onChangeFftsize = (event) => {
    setState({ ...state, size: parseInt(event.target.value) });
  };

  const onSubmitFftsize = () => {
    const intSize = parseInt(state.size);
    if (intSize >= 64 && Math.sqrt(intSize) % 2 === 0) {
      props.updateFftsize(state.size);
      setState({
        ...state,
        error: {
          ...state.error,
          size: '',
        },
      });
    } else {
      setState({
        ...state,
        error: {
          ...state.error,
          size: 'Size must be a power of 2 and at least 64',
        },
      });
    }
  };

  const onChangeTaps = (event) => {
    setState({ ...state, taps: event.target.value });
  };

  const onSubmitTaps = () => {
    let taps = new Array(1).fill(1);
    // make sure the string is a valid array
    let taps_string = state.taps;
    if (taps_string[0] === '[' && taps_string.slice(-1) === ']') {
      taps = taps_string.slice(1, -1).split(',');
      taps = taps.map((x) => parseFloat(x));
      taps = Float32Array.from(taps);
      props.updateBlobTaps(taps);
      // We apply the taps when we download the IQ data, so we have to clear both
      window.iq_data = {};
      window.fft_data = {};
      console.log('valid taps, found', taps.length, 'taps');
    } else {
      console.error('invalid taps');
    }
    props.updateBlobTaps(taps);
  };

  return (
    <Form>
      {/* When you press this button it will make autoscale run during the next call to select_fft, then it will turn itself off */}
      <Button className="mb-3" variant="secondary" onClick={props.updateAutoScale} style={{ width: '100%', marginTop: '5px' }}>
        Autoscale
      </Button>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Magnitude Max</Form.Label>
        <div style={{ color: 'red', marginBottom: '2px' }}>{state.error.magMax}</div>
        <InputGroup className="mb-3">
          <Form.Control type="text" value={magnitudeMax.magnitudeMax} onChange={onChangeTargetMagnitudeMax} size="sm" />
          <Button variant="secondary" onClick={onSubmitMagnitudeMax}>
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Magnitude Min</Form.Label>
        <div style={{ color: 'red', marginBottom: '2px' }}>{state.error.magMin}</div>
        <InputGroup className="mb-3">
          <Form.Control type="text" value={magnitudeMin.magnitudeMin} onChange={onChangeTargetMagnitudeMin} size="sm" />
          <Button variant="secondary" onClick={onSubmitMagnitudeMin}>
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>FFT Size</Form.Label>
        <div style={{ color: 'red', marginBottom: '2px' }}>{state.error.size}</div>
        <InputGroup className="mb-3">
          <Form.Control type="text" defaultValue={state.size} onChange={onChangeFftsize} size="sm" />
          <Button variant="secondary" onClick={onSubmitFftsize}>
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>FIR Filter Taps</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control type="text" defaultValue={state.taps} onChange={onChangeTaps} size="sm" />
          <Button variant="secondary" onClick={onSubmitTaps}>
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </InputGroup>
      </Form.Group>

      <DropdownButton title="Data Type" variant="secondary" style={{ width: '100%' }} className="mb-3" id="dropdown-menu-align-right" onSelect>
        <Dropdown.Item eventKey="cf32_le">complex float32</Dropdown.Item>
        <Dropdown.Item eventKey="ci16_le">complex int16</Dropdown.Item>
      </DropdownButton>

      <DropdownButton
        title="Window"
        variant="secondary"
        style={{ width: '100%' }}
        className="mb-3"
        id="dropdown-menu-align-right"
        onSelect={onChangeWindowFunction}
      >
        <Dropdown.Item active={state.windowFunction === 'hamming'} eventKey="hamming">
          Hamming
        </Dropdown.Item>
        <Dropdown.Item active={state.windowFunction === 'rectangle'} eventKey="rectangle">
          Rectangle
        </Dropdown.Item>
        <Dropdown.Item active={state.windowFunction === 'hanning'} eventKey="hanning">
          Hanning
        </Dropdown.Item>
        <Dropdown.Item active={state.windowFunction === 'barlett'} eventKey="barlett">
          Barlett
        </Dropdown.Item>
        <Dropdown.Item active={state.windowFunction === 'blackman'} eventKey="blackman">
          Blackman
        </Dropdown.Item>
      </DropdownButton>
      <p></p>
    </Form>
  );
};

export default SettingsPane;
