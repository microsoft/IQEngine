// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Link } from 'react-router-dom';
import FileBrowserContainer from './Containers/FileBrowserContainer';
import SpectrogramContainer from './Containers/SpectrogramContainer';
import RecordingsListContainer from './Containers/RecordingsListContainer';

const App = () => {
  return (
    <div>
      <h1 className="display-1">
        <Link to="/">
          <center>IQEngine</center>
        </Link>
      </h1>

      <Routes>
        <Route exact path="/" element={<FileBrowserContainer />} />
        <Route path="/recordings" element={<RecordingsListContainer />}/>
        <Route path="/spectrogram/:recording" element={<SpectrogramContainer />} />
      </Routes>
    </div>
  );
};
export default App;
