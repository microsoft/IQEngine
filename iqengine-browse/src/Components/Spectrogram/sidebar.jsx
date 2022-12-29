// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Nav } from 'react-bootstrap';
import LeftPanel from './LeftPanel';

const Sidebar = (props) => {
  //from: https://stackoverflow.com/questions/60482018/make-a-sidebar-from-react-bootstrap
  return (
    <Nav className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
      <Nav.Item>
        <LeftPanel
          handleFftSize={props.handleFftSize}
          handleMagnitudeMax={props.handleMagnitudeMax}
          handleMagnitudeMin={props.handleMagnitudeMin}
          updateBlobTaps={props.updateBlobTaps}
          meta={props.meta}
        />
      </Nav.Item>
    </Nav>
  );
};

export default Sidebar;
