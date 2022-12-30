import { returnMetaDataBlob } from '../Store/Actions/FetchMetaActions';
const { BlobServiceClient } = require('@azure/storage-blob');

// Thunk function

export const FetchMeta = (connection) => async (dispatch) => {
  console.log('running fetchMeta');
  let meta_string = '';
  let blobName = connection.recording + '.sigmf-meta'; // has to go outside of condition or else react gets mad
  if (connection.metafilehandle === undefined) {
    let { accountName, containerName, sasToken } = connection;
    if (containerName === '') {
      console.error('container name was not filled out for some reason');
    }

    // Get the blob client
    const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    const downloadBlockBlobResponse = await blobClient.download();
    const blob = await downloadBlockBlobResponse.blobBody;
    meta_string = await blob.text();
  } else {
    let fileHandle = connection.metafilehandle;
    const file = await fileHandle.getFile();
    meta_string = await file.text();
  }

  const meta_json = JSON.parse(meta_string);
  dispatch(returnMetaDataBlob(meta_json));
};
