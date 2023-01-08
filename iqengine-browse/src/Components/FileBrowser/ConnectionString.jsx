// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';

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
    <div className="file-azure">
      <h4>Browse Azure Blob Storage</h4>
      <form>
        <div>
          <label>Storage Account Name:</label>
          <input type="text" defaultValue={accountName} onChange={onAccountNameChange} size="sm" />
        </div>
        <div>
          <label>Container Name:</label>
          <input type="text" defaultValue={containerName} onChange={onContainerNameChange} size="sm" />
        </div>
        <div>
          <label>SAS Token for Container:</label>
          <input type="password" defaultValue={sasToken} onChange={onSasTokenChange} size="sm" />
        </div>
      </form>

      <button className="btn btn-success" onClick={onSubmit}>
        Browse Recordings
      </button>
    </div>
  );
};

export default ConnectionString;
