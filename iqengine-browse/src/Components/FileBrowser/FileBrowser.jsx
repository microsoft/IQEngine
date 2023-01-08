// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { Component } from 'react';
import LocalFileChooser from './LocalFileChooser';
import './FileBrowser.css';
import ConnectionString from './ConnectionString';
import RecordingsBrowser from './RecordingsBrowser';

const FileBrowser = (props) => {
  const state = {
    recording: props.recording, // look at the end of DataFetcher to see how this data structure works
    accountName: props.connection.accountName,
    containerName: props.connection.containerName,
    sasToken: props.connection.sasToken,
    metafilehandle: props.connection.metafilehandle,
    datafilehandle: props.connection.datafilehandle,
  };

  return (
    <div className="file-browser">
      <div className="file-source">
        <LocalFileChooser
          className="file-local"
          setRecordingList={props.setRecordingList}
          updateConnectionMetaFileHandle={props.updateConnectionMetaFileHandle}
          updateConnectionDataFileHandle={props.updateConnectionDataFileHandle}
          metafilehandle={state.metafilehandle}
          datafilehandle={state.datafilehandle}
        />
        <ConnectionString
          className="file-azure"
          setRecordingList={props.fetchRecordingsList}
          updateConnectionAccountName={props.updateConnectionAccountName}
          updateConnectionContainerName={props.updateConnectionContainerName}
          updateConnectionSasToken={props.updateConnectionSasToken}
          accountName={state.accountName}
          containerName={state.containerName}
          sasToken={state.sasToken}
        />
      </div>

      <RecordingsBrowser
        className="recordings"
        updateConnectionRecording={props.updateConnectionRecording}
        updateConnectionMetaFileHandle={props.updateConnectionMetaFileHandle}
        updateConnectionDataFileHandle={props.updateConnectionDataFileHandle}
        data={state.recording.recordingsList}
      />
    </div>
  );
};

export default FileBrowser;
