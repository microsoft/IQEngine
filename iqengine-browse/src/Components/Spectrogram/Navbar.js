// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Nav } from 'react-bootstrap';

// Stateless Functional Component

const NavBar = () => {
  return (
    <Nav variant="pills" className="navbar navbar-dark bg-dark" activeKey="/" onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}>
      <Nav.Item>
        <Nav.Link href="/">Home</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default NavBar;
