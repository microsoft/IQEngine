// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createAsyncThunk } from '@reduxjs/toolkit';

function convolve(array, taps) {
  //console.log(taps);

  // make sure its an odd number of taps
  if (taps.length % 2 !== 1) taps.push(0);

  let I = array.filter((element, index) => {
    return index % 2 === 0;
  });
  let Q = array.filter((element, index) => {
    return index % 2 === 1;
  });

  var offset = ~~(taps.length / 2);
  var output = new Float32Array(array.length);
  for (var i = 0; i < array.length / 2; i++) {
    var kmin = i >= offset ? 0 : offset - i;
    var kmax = i + offset < array.length / 2 ? taps.length - 1 : array.length / 2 - 1 - i + offset;
    output[i * 2] = 0; // I
    output[i * 2 + 1] = 0; // Q
    for (var k = kmin; k <= kmax; k++) {
      output[i * 2] += I[i - offset + k] * taps[k]; // I
      output[i * 2 + 1] += Q[i - offset + k] * taps[k]; // Q
    }
  }
  return output;
}

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

const FetchMoreData = createAsyncThunk('FetchMoreData', async (args) => {
  console.log('running FetchMoreData');
  const { connection, blob } = args;
  let offset = blob.size;

  let bytes_per_sample = 2;
  if (window.data_type === 'ci16_le') {
    bytes_per_sample = 2;
  } else if (window.data_type === 'cf32_le') {
    bytes_per_sample = 4;
  } else {
    bytes_per_sample = 2;
  }

  let count = 1024 * 2000 * bytes_per_sample; // must be a power of 2, FFT currently doesnt support anything else.
  var startTime = performance.now();
  let buffer;
  if (connection.datafilehandle === undefined) {
    // using Azure blob storage
    var { accountName, containerName, sasToken, recording } = connection;

    while (recording === '') {
      console.log('waiting'); // hopefully this doesn't happen, and if it does it should be pretty quick because its the time it takes for the state to set
    }
    let blobName = recording + '.sigmf-data';

    // Get the blob client TODO: REFACTOR SO WE DONT HAVE TO REMAKE THE CLIENT EVERY TIME!
    const { BlobServiceClient } = require('@azure/storage-blob');
    const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const downloadBlockBlobResponse = await blobClient.download(offset, count);
    const blob = await downloadBlockBlobResponse.blobBody;
    buffer = await blob.arrayBuffer();
  } else {
    // Use a local file
    let handle = connection.datafilehandle;
    const fileData = await handle.getFile();
    buffer = await readFileAsync(fileData.slice(offset, offset + count));
  }
  var endTime = performance.now();
  console.log('Fetching more data took', endTime - startTime, 'milliseconds');
  let samples;
  if (window.data_type === 'ci16_le') {
    samples = new Int16Array(buffer);
    samples = convolve(samples, blob.taps);
    samples = Int16Array.from(samples); // convert back to int TODO: clean this up
  } else if (window.data_type === 'cf32_le') {
    samples = new Float32Array(buffer);
    samples = convolve(samples, blob.taps);
  } else {
    console.error('unsupported data_type');
    samples = new Int16Array(buffer);
  }
  return samples;
});

export default FetchMoreData;
