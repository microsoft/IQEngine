// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';

import SettingsPane from './SettingsPane';
import InfoPane from './InfoPane';
import Accordion from 'react-bootstrap/Accordion';

export default function LeftPanel(props) {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Settings</Accordion.Header>
        <Accordion.Body>
          <SettingsPane
            handleFftSize={props.handleFftSize}
            handleMagnitudeMax={props.handleMagnitudeMax}
            handleMagnitudeMin={props.handleMagnitudeMin}
            updateBlobTaps={props.updateBlobTaps}
          />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Info</Accordion.Header>
        <Accordion.Body>
          <InfoPane meta={props.meta} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Annotations</Accordion.Header>
        <Accordion.Body></Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
