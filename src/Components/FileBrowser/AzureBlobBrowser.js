// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const AzureBlobBrowser = (props) => {
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
    props.updateConnectionAccountName(accountName);
    props.updateConnectionContainerName(containerName);
    props.updateConnectionSasToken(sasToken);
    props.setRecordingList({ accountName: accountName, containerName: containerName, sasToken: sasToken }); // updates the parent (App.js) state with the RecordingList
  };

  return (
    <div id="ConnectionStringContainer" className="container-fluid">
      <h4 style={{ textAlign: 'center' }}>Browse Azure Blob Storage</h4>
      <div className="form-group">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Storage Account Name:</Form.Label>
          <Form.Control type="text" defaultValue={accountName} onChange={onAccountNameChange} size="sm" />

          <Form.Label>Container Name:</Form.Label>
          <Form.Control type="text" defaultValue={containerName} onChange={onContainerNameChange} size="sm" />

          <Form.Label>SAS Token for Container:</Form.Label>
          <Form.Control type="text" defaultValue={sasToken} onChange={onSasTokenChange} size="sm" />
        </Form.Group>

        <Button variant='success' onClick={onSubmit}>
          Browse Recordings
        </Button>
      </div>
    </div>
  );
};

export default AzureBlobBrowser;
