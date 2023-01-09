// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { Component, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import './SettingsPane.css';

const SettingsPane = (props) => {
  const [state, setState] = useState({
    size: 1024,
    magnitudeMax: 255,
    magnitudeMin: 30,
    taps: '[1]',
    windowFunction: 'hamming',
    error: { magnitudeMax: '', magnitudeMin: '', size: '' },
  });

  const [open, setOpen] = useState(true);

  const onChangeMagnitudeMax = (e) => {
    setState(...state, {
      magnitudeMax: e.target.value,
    });
  };

  const onChangeWindowFunction = (event) => {
    setState(...state, {
      windowFunction: event,
    });
  };

  const onChangeMagnitudeMin = (event) => {
    setState(...state, {
      magnitudeMin: event.target.value,
    });
  };

  const onChangeFftsize = (event) => {
    setState(...state, {
      size: event.target.value,
    });
  };

  const onChangeTaps = (event) => {
    setState(...state, {
      taps: event.target.value,
    });
  };

  const validTaps = () => {
    let taps = new Array(1).fill(1);

    let taps_string = this.state.taps;
    if (taps_string[0] === '[' && taps_string.slice(-1) === ']') {
      taps = taps_string.slice(1, -1).split(',');
      taps = taps.map((x) => parseFloat(x));
      taps = Float32Array.from(taps);
      props.updateBlobTaps(taps);
      return true;
    }
    return false;
  };

  const validFftSize = () => {
    //''
    if (state.fftSize >= 64 && Math.sqrt(state.fftSize) % 2 === 0) {
      return true;
    }
    return false;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (validTaps() && validFftSize()) {
      props.updateMagnitudeMax(state.magnitudeMax);
      props.updateMagnitudeMin(state.magnitudeMin);
      props.updateFftsize(state.size);
      props.updateWindowChange(e);
      state.error = '';
    } else {
      if (!validTaps()) {
        state.error = 'Check FftSide string is a valid array';
      }
      if (!validFftSize()) {
        state.error += 'Size must be a power of 2 and at least 64';
      }
    }
  };

  const togglePanel = () => {
    setOpen(!open);
  };

  return (
    <div className={"settings-pane " + open}>
      <div className="settings-pane-title bg6">
        <div className="settings-pane-text">Settings</div>
        <button className="settings-pane-close" onClick={togglePanel}></button>
      </div>
      <form className="settings-pane-form">
        <div className="settings-pane-form-row">
          <label className="settings-pane-form-label">Magnitude Max</label>
          <input
            type="number"
            min="0"
            max="255"
            className="settings-pane-form-input"
            defaultValue={state.magnitudeMax}
            onChange={onChangeMagnitudeMax}
          />
        </div>
        <div className="settings-pane-form-row">
          <label className="settings-pane-form-label">Magnitude Min</label>
          <input
            type="number"
            min="0"
            max="255"
            className="settings-pane-form-input"
            defaultValue={state.magnitudeMin}
            onChange={onChangeMagnitudeMin}
          />
        </div>
        <div className="settings-pane-form-row">
          <label className="settings-pane-form-label">FFT Size</label>
          <input type="number" min="64" className="settings-pane-form-input" defaultValue={state.size} onChange={onChangeFftsize} />
        </div>
        <div className="settings-pane-form-row">
          <label className="settings-pane-form-label">FIR Filter Taps</label>
          <input type="text" className="settings-pane-form-input" defaultValue={state.taps} onChange={onChangeTaps} />
        </div>
        <div className="settings-pane-form-row">
          <label className="settings-pane-form-label">Data Type</label>
          <select className="settings-pane-form-input">
            <option value="">Select</option>
            <option value="cf32_le">complex float32</option>
            <option value="cf16_le">complex float32</option>
          </select>
        </div>
        <div className="settings-pane-form-row">
          <label className="settings-pane-form-label">Window</label>
          <select className="settings-pane-form-input" onChange={onChangeWindowFunction}>
            <option value="">Select</option>
            <option value="hamming">Hamming</option>
            <option value="none">None</option>
          </select>
        </div>
        <button className="btn btn-success" onClick={onSubmit}>
          Apply
        </button>
      </form>
    </div>
  );
};

export default SettingsPane;
