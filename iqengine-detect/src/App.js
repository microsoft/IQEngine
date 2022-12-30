// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import './App.css';
import { Button, Form, FormGroup, Label, Input, FormText, Collapse } from 'reactstrap';
import axios from 'axios';
import React, { useState } from 'react';
import Spectogram from './annotated_spectrogram.png';

function App() {
  const [signalCount, setSignalCount] = useState('');
  //const [imagePath, setImagePath] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const queryParams = {
      fileName: event.target.fileName.value,
      timeWindow: event.target.timeWindow.value,
      powerThreshold: event.target.powerThreshold.value,
      timeMargin: event.target.timeMargin.value,
      minBW: event.target.minBW.value,
    };
    //console.log(queryParams)
    try {
      setIsOpen(false);
      setLoading(true);
      let resp = await axios.get('http://127.0.0.1:8000/signals', { params: queryParams });
      setLoading(false);

      let signals = resp.data;
      //console.log(signals);
      setSignalCount(signals);
      setIsOpen(true);
      //setImagePath('annotated_spectrogram.png');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <h1 className="title">IQEngine Signal Detection</h1>
      <div className="form-result-container">
        <FormContainer handleSubmit={handleSubmit} />
        <Collapse isOpen={isOpen}>
          <p>
            <strong>{signalCount} signals found</strong>
          </p>
        </Collapse>
        <Collapse isOpen={isLoading}>
          <p>loading...</p>
        </Collapse>
        {/* <ResultContainer signals={signalCount} isOpen={isOpen} isLoading={isLoading} /> */}
      </div>
    </div>
  );
}

function FormContainer(props) {
  return (
    <div className="form-container">
      <Form onSubmit={props.handleSubmit}>
        <FormGroup>
          <Label for="file-name-input">File Name</Label>
          <Input type="search" name="fileName" id="file-name-input" placeholder="ex: synthetic_int16" required />
        </FormGroup>
        <FormGroup>
          <Label for="intensity-input">Time Window Size</Label>
          <Input type="number" name="timeWindow" id="time-window-input" placeholder="ex: 10" required />
          <FormText>Samples</FormText>
        </FormGroup>
        <FormGroup>
          <Label for="box-padding-input">Power Threshold</Label>
          <Input type="number" name="powerThreshold" id="power-threshold-input" placeholder="ex: 20" required />
          <FormText>dB</FormText>
        </FormGroup>
        <FormGroup>
          <Label for="box-padding-input">Time Margin</Label>
          <Input type="search" name="timeMargin" id="time-margin-input" placeholder="ex: 0.001" required />
          <FormText>Seconds</FormText>
        </FormGroup>
        <FormGroup>
          <Label for="box-padding-input">Minimum Bandwidth</Label>
          <Input type="number" name="minBW" id="min-bw-input" placeholder="ex: 10000" required />
          <FormText>Hz</FormText>
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    </div>
  );
}

function ResultContainer(props) {
  return (
    <div className="results-container">
      <Collapse isOpen={props.isOpen}>
        <p>{props.signals} signals found</p>
      </Collapse>
      <div className="spectogram-viewer">
        <Collapse isOpen={props.isOpen}>
          <img src={Spectogram} alt="spectogram"></img>
        </Collapse>
        <Collapse isOpen={props.isLoading}>
          <p>loading..</p>
        </Collapse>
      </div>
    </div>
  );
}

export default App;
