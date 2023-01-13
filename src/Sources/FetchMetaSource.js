import { updateBlobTotalBytes } from '../Store/Actions/BlobActions';
import { updateConnectionBlobClient } from '../Store/Actions/ConnectionActions';
import { returnMetaDataBlob } from '../Store/Actions/FetchMetaActions';
const { BlobServiceClient } = require('@azure/storage-blob');

// Thunk function

export const FetchMeta = (connection) => async (dispatch) => {
  console.log('running fetchMeta');
  let meta_string = '';
  let blobName = connection.recording + '.sigmf-meta'; // has to go outside of condition or else react gets mad
  const dataBlobName = connection.recording + '.sigmf-data';
  if (connection.metafilehandle === undefined) {
    let { accountName, containerName, sasToken } = connection;
    if (containerName === '') {
      console.error('container name was not filled out for some reason');
    }
    // Get the blob client
    const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const blobDataClient = containerClient.getBlobClient(dataBlobName);
    const properties = await blobDataClient.getProperties();
    const numBytes = properties.contentLength;
    dispatch(updateBlobTotalBytes(numBytes));
    dispatch(updateConnectionBlobClient(blobDataClient));
    const downloadBlockBlobResponse = await blobClient.download();
    const blob = await downloadBlockBlobResponse.blobBody;
    meta_string = await blob.text();
  } else {
    const metaFile = await connection.metafilehandle.getFile();
    const dataFile = await connection.datafilehandle.getFile();
    meta_string = await metaFile.text();
    const numBytes = dataFile.size;
    dispatch(updateBlobTotalBytes(numBytes));
  }

  const meta_json = JSON.parse(meta_string);
  dispatch(returnMetaDataBlob(meta_json));
};
