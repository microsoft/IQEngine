// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class AzureBlobBrowser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountName: '',
      containerName: '',
      sasToken: '',
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props !== state) {
      return {
        accountName: props.accountName || process.env.REACT_APP_AZURE_BLOB_ACCOUNT_NAME,
        containerName: props.containerName || process.env.REACT_APP_AZURE_BLOB_CONTAINER_NAME,
        sasToken: props.sasToken || process.env.REACT_APP_AZURE_BLOB_SAS_TOKEN,
      };
    }
  }

  onAccountNameChange = (event) => {
    this.setState({
      accountName: event.target.value,
    });
  };

  onContainerNameChange = (event) => {
    this.setState({
      containerName: event.target.value,
    });
  };

  onSasTokenChange = (event) => {
    this.setState({
      sasToken: event.target.value,
    });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    // updates it in the store
    const { accountName, containerName, sasToken } = this.state;
    this.props.updateConnectionAccountName(accountName);
    this.props.updateConnectionContainerName(containerName);
    this.props.updateConnectionSasToken(sasToken);
    this.props.setRecordingList({ accountName: accountName, containerName: containerName, sasToken: sasToken }); // updates the parent (App.js) state with the RecordingList
  };

  render() {
    const { accountName, containerName, sasToken } = this.state;

    return (
      <div id="ConnectionStringContainer" className="container-fluid">
        <h4 style={{ textAlign: 'center' }}>Browse Azure Blob Storage</h4>
        <div className="form-group">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Storage Account Name:</Form.Label>
            <Form.Control type="text" defaultValue={accountName} onChange={this.onAccountNameChange} size="sm" />

            <Form.Label>Container Name:</Form.Label>
            <Form.Control type="text" defaultValue={containerName} onChange={this.onContainerNameChange} size="sm" />

            <Form.Label>SAS Token for Container:</Form.Label>
            <Form.Control type="text" defaultValue={sasToken} onChange={this.onSasTokenChange} size="sm" />
          </Form.Group>

          <Button className="btn btn-success" onClick={this.onSubmit}>
            Browse Recordings
          </Button>
        </div>
      </div>
    );
  }
}

export default AzureBlobBrowser;
