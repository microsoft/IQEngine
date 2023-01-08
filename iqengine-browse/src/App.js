// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Components/Home/Home';
import FileBrowserContainer from './Containers/FileBrowserContainer';
import SpectrogramContainer from './Containers/SpectrogramContainer';
import './App.css';

const App = () => {
  return (
    <>
      <header>
        <div>
          <Link to="/" className="header-title">
            IQEngine
          </Link>
        </div>
        <div>
          <Link to="/" className="header-link home">
            Home
          </Link>
          <Link to="/browser" className="header-link browser">
            Browser
          </Link>
        </div>
      </header>

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/browser" element={<FileBrowserContainer />} />
        <Route path="/spectrogram/:recording" element={<SpectrogramContainer />} />
      </Routes>
    </>
  );
};

export default App;
