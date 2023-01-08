// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { Component } from 'react';
import LocalFileBrowser from './LocalFileBrowser';
import './FileBrowser.css';
import AzureBlobBrowser from './AzureBlobBrowser';
import RecordingsList from './RecordingsList';

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
        <LocalFileBrowser
          setRecordingList={props.setRecordingList}
          updateConnectionMetaFileHandle={props.updateConnectionMetaFileHandle}
          updateConnectionDataFileHandle={props.updateConnectionDataFileHandle}
          metafilehandle={state.metafilehandle}
          datafilehandle={state.datafilehandle}
        />
        <AzureBlobBrowser
          setRecordingList={props.fetchRecordingsList}
          updateConnectionAccountName={props.updateConnectionAccountName}
          updateConnectionContainerName={props.updateConnectionContainerName}
          updateConnectionSasToken={props.updateConnectionSasToken}
          accountName={state.accountName}
          containerName={state.containerName}
          sasToken={state.sasToken}
        />
      </div>
      <RecordingsList
        updateConnectionRecording={props.updateConnectionRecording}
        updateConnectionMetaFileHandle={props.updateConnectionMetaFileHandle}
        updateConnectionDataFileHandle={props.updateConnectionDataFileHandle}
        data={state.recording.recordingsList}
      />
    </div>
  );
};

export default FileBrowser;
