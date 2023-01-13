import Plot from 'react-plotly.js';
import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Button from 'react-bootstrap/Button';

function randomPoints() {
  var pts = new Array(1000);
  for (var i = 0; i < 1000; i++) {
    pts[i] = Math.floor(Math.random() * 1000);
  }
  return pts;
}

function randomFrequencyPoints() {
  var pts = new Array(1000);
  var count = 0;
  for (var i = 0; i < 1000; i += 0.01) {
    pts[count] = Math.sin(i / 0.05) + 1;
    count += 1;
  }
  return pts;
}

let narrowPoints = randomFrequencyPoints();
let y = randomPoints();

const TimePlot = (props) => {
  const [modal, setModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState('time');
  const toggle = () => {
    setModal(!modal);
  };

  const onChangeSelectedOption = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div>
      <Button type="button" variant="secondary" onClick={toggle} style={{ marginLeft: '15px' }}>
        Placeholder for Time/Freq Plot
      </Button>

      <Modal isOpen={modal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Plot</ModalHeader>
        <ModalBody>
          <div style={{ marginBottom: '15px' }}>
            <input type="radio" value="time" onChange={onChangeSelectedOption} checked={selectedOption === 'time'} style={{ marginRight: '5px' }} />
            Time
            <input
              type="radio"
              value="frequency"
              onChange={onChangeSelectedOption}
              checked={selectedOption === 'frequency'}
              style={{ marginLeft: '15px', marginRight: '5px' }}
            />
            Frequency
          </div>
          {selectedOption === 'time' && (
            <Plot
              data={[
                {
                  y: y,
                  type: 'scatter',
                  marker: { color: 'red' },
                },
              ]}
              layout={{
                title: 'Time Domain Plot',
                autosize: true,
                dragmode: 'pan',
                xaxis: {
                  title: 'Time',
                  rangeslider: { range: [0, 1000] },
                },
                yaxis: {
                  title: 'Frequency',
                  fixedrange: true,
                },
              }}
              config={{
                displayModeBar: false,
                scrollZoom: true,
              }}
            />
          )}
          {selectedOption === 'frequency' && (
            <Plot
              data={[
                {
                  y: narrowPoints,
                  type: 'scatter',
                  marker: { color: 'green' },
                },
              ]}
              layout={{
                title: 'Frequency Domain Plot',
                autosize: true,
                dragmode: 'pan',
                xaxis: {
                  title: 'Frequency',
                  range: [0, 100],
                  rangeslider: { range: [0, 100] },
                },
                yaxis: {
                  title: 'Amplitude',
                  fixedrange: true,
                },
              }}
              config={{
                displayModeBar: false,
                scrollZoom: true,
              }}
            />
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default TimePlot;
