// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createAsyncThunk } from '@reduxjs/toolkit';
import { TILE_SIZE_IN_BYTES } from '../Utils/constants';
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

  let offset = ~~(taps.length / 2);
  let output = new Float32Array(array.length);
  for (let i = 0; i < array.length / 2; i++) {
    let kmin = i >= offset ? 0 : offset - i;
    let kmax = i + offset < array.length / 2 ? taps.length - 1 : array.length / 2 - 1 - i + offset;
    output[i * 2] = 0; // I
    output[i * 2 + 1] = 0; // Q
    for (let k = kmin; k <= kmax; k++) {
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
  const { tile, connection, blob, meta } = args;

  // FIXME the first time this function is called, the data_type hasnt been set yet
  if (!meta.global['core:datatype']) {
    console.log("WARNING: data_type hasn't been set yet");
    return { tile: -1, samples: new Int16Array(0), data_type: 'ci16_le' }; // return no samples
  }
  const data_type = meta.global['core:datatype'];

  let offset = tile * TILE_SIZE_IN_BYTES; // in bytes
  let count = TILE_SIZE_IN_BYTES; // in bytes

  let startTime = performance.now();
  let buffer;
  if (connection.datafilehandle === undefined) {
    // using Azure blob storage

    // THE FOLLOWING IS TEMPORARY UNTIL WE GET THE REDUX STATE FOR BLOBCLIENT WORKING
    let { accountName, containerName, sasToken, recording } = connection;
    while (recording === '') {
      console.log('waiting'); // hopefully this doesn't happen, and if it does it should be pretty quick because its the time it takes for the state to set
    }
    let blobName = recording + '.sigmf-data';
    const { BlobServiceClient } = require('@azure/storage-blob');
    const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const tempBlobClient = containerClient.getBlobClient(blobName);

    console.log('offset:', offset, 'count:', count);
    //const downloadBlockBlobResponse = await connection.blobClient.download(offset, count);
    const downloadBlockBlobResponse = await tempBlobClient.download(offset, count);
    const blob = await downloadBlockBlobResponse.blobBody;
    buffer = await blob.arrayBuffer();
  } else {
    // Use a local file
    let handle = connection.datafilehandle;
    const fileData = await handle.getFile();
    console.log('offset:', offset, 'count:', count);
    buffer = await readFileAsync(fileData.slice(offset, offset + count));
  }
  let endTime = performance.now();
  console.log('Fetching more data took', endTime - startTime, 'milliseconds');
  let samples;
  if (data_type === 'ci16_le') {
    samples = new Int16Array(buffer);
    samples = convolve(samples, blob.taps);
    samples = Int16Array.from(samples); // convert back to int TODO: clean this up
  } else if (data_type === 'cf32_le') {
    samples = new Float32Array(buffer);
    samples = convolve(samples, blob.taps);
  } else {
    console.error('unsupported data_type');
    samples = new Int16Array(buffer);
  }
  return { tile: tile, samples: samples, data_type: data_type }; // these represent the new samples
});

export default FetchMoreData;
