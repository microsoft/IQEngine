// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateAccountName, updateContainerName, updateSasToken } from '../../reducers/connectionSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function ConnectionStringInput(props) {
  const dispatch = useDispatch();
  const [accountName, setAccountName] = useState(process.env.REACT_APP_AZURE_BLOB_ACCOUNT_NAME); // makes a new state within the component (not redux)
  const [containerName, setContainerName] = useState(process.env.REACT_APP_AZURE_BLOB_CONTAINER_NAME);
  const [sasToken, setSasToken] = useState(process.env.REACT_APP_AZURE_BLOB_SAS_TOKEN);

  const onAccountNameChange = (event) => {
    setAccountName(event.target.value);
  }; // updates it visually
  const onContainerNameChange = (event) => {
    setContainerName(event.target.value);
  };
  const onSasTokenChange = (event) => {
    setSasToken(event.target.value);
  };
  const onSubmit = async () => {
    // updates it in the store
    dispatch(updateAccountName(accountName));
    dispatch(updateContainerName(containerName));
    dispatch(updateSasToken(sasToken));

    props.setRecordingList(await GetFilesFromBlob(accountName, containerName, sasToken)); // updates the parent (App.js) state with the RecordingList
  };

  return (
    <div id="ConnectionStringContainer" className="container-fluid">
      <div className="form-group">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Storage Account Name:</Form.Label>
          <Form.Control type="text" value={accountName} onChange={onAccountNameChange} size="sm" />

          <Form.Label>Container Name:</Form.Label>
          <Form.Control type="text" value={containerName} onChange={onContainerNameChange} size="sm" />

          <Form.Label>SAS Token for Container:</Form.Label>
          <Form.Control type="text" value={sasToken} onChange={onSasTokenChange} size="sm" />
        </Form.Group>

        <Button className="btn btn-success" onClick={onSubmit}>
          Browse Recordings
        </Button>
      </div>
    </div>
  );
}

// [Browsers only] A helper method used to convert a browser Blob into string.
async function blobToString(blob) {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onloadend = (ev) => {
      resolve(ev.target.result);
    };
    fileReader.onerror = reject;
    fileReader.readAsText(blob);
  });
}

function parseMeta(json_string, baseUrl, fName) {
  const obj = JSON.parse(json_string); // string to JSON
  return {
    name: fName,
    sampleRate: obj['global']['core:sample_rate'] / 1e6, // in MHz
    dataType: obj['global']['core:datatype'],
    frequency: obj['captures'][0]['core:frequency'] / 1e6, // in MHz
    annotations: obj['annotations'],
    numberOfAnnotation: obj['annotations'].length,
    author: obj['global']['core:author'],
    type: 'file',
    thumbnailUrl: baseUrl + fName + '.png',
  };
}

async function GetFilesFromBlob(accountName, containerName, sasToken) {
  const { BlobServiceClient } = require('@azure/storage-blob');

  const baseUrl = `https://${accountName}.blob.core.windows.net/${containerName}/`;
  const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // List the blob(s) in the container.
  const entries = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    // only process meta-data files
    if (blob.name.split('.').pop() === 'sigmf-meta') {
      const blobClient = containerClient.getBlobClient(blob.name);
      const fName = blob.name.split('.')[0];

      // Get blob content from position 0 to the end, get downloaded data by accessing downloadBlockBlobResponse.blobBody
      const downloadBlockBlobResponse = await blobClient.download();
      const json_string = await blobToString(await downloadBlockBlobResponse.blobBody);

      // entries is a list of .sigmf-meta files, including the /'s for ones inside dirs, later on we tease them out
      entries.push(parseMeta(json_string, baseUrl, fName));
    }
  }
  console.log(entries);
  return entries;
}
