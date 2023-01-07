// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Nav } from 'react-bootstrap';
import SettingsPane from './SettingsPane';
import InfoPane from './InfoPane';
import Accordion from 'react-bootstrap/Accordion';

const Sidebar = (props) => {
  //from: https://stackoverflow.com/questions/60482018/make-a-sidebar-from-react-bootstrap
  return (
    <Nav className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
      <Nav.Item>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Settings</Accordion.Header>
            <Accordion.Body>
              <SettingsPane
                updateBlobTaps={props.updateBlobTaps}
                updateMagnitudeMax={props.updateMagnitudeMax}
                updateMagnitudeMin={props.updateMagnitudeMin}
                updateFftsize={props.updateFftsize}
                updateWindowChange={props.updateWindowChange}
                meta={props.meta}
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
      </Nav.Item>
    </Nav>
  );
};

export default Sidebar;
