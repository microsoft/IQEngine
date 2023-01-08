// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import './AzureBlobBrowser.css';

const ConnectionString = (props) => {
  const [accountName, setAccountName] = useState(props.accountName || process.env.REACT_APP_AZURE_BLOB_ACCOUNT_NAME);
  const [containerName, setContainerName] = useState(props.containerName || process.env.REACT_APP_AZURE_BLOB_CONTAINER_NAME);
  const [sasToken, setSasToken] = useState(process.env.REACT_APP_AZURE_BLOB_SAS_TOKEN);

  const onAccountNameChange = (event) => {
    setAccountName(event.target.value);
  };

  const onContainerNameChange = (event) => {
    setContainerName(event.target.value);
  };

  const onSasTokenChange = (event) => {
    setSasToken(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    // updates it in the store
    props.updateConnectionAccountName(accountName);
    props.updateConnectionContainerName(containerName);
    props.updateConnectionSasToken(sasToken);
    props.setRecordingList({ accountName: accountName, containerName: containerName, sasToken: sasToken }); // updates the parent (App.js) state with the RecordingList
  };
  return (
    <div className="file-azure bg8">
      <h4 className="file-azure-title bg6">Browse Azure Blob Storage</h4>
      <form className="iq-form">
        <div className="iq-form-row bg2">
          <label className="iq-form-label">Storage Account Name:</label>
          <input className="iq-form-input" type="text" defaultValue={accountName} onChange={onAccountNameChange} size="sm" />
        </div>
        <div className="iq-form-row bg2">
          <label className="iq-form-label">Container Name:</label>
          <input className="iq-form-input" type="text" defaultValue={containerName} onChange={onContainerNameChange} size="sm" />
        </div>
        <div className="iq-form-row bg2">
          <label className="iq-form-label">SAS Token for Container:</label>
          <input className="iq-form-input" type="password" defaultValue={sasToken} onChange={onSasTokenChange} size="sm" />
        </div>
        <button className="btn btn-success" onClick={onSubmit}>
          Browse Recordings
        </button>
      </form>
    </div>
  );
};

export default ConnectionString;
