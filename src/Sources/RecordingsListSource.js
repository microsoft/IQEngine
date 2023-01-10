import { fetchRecordingsListFailure, fetchRecordingsListLoading, fetchRecordingsListSuccess } from '../Store/Actions/RecordingsListActions';

const { BlobServiceClient } = require('@azure/storage-blob');

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
  const emailName = obj['global']['core:author'];
  var author = emailName.split('<');
  var email;
  if (author.length === 1) {
    email = null;
  } else {
    email = author[1].split('>');
    email = email[0].trim();
    author = author[0].trim();
  }

  return {
    name: fName,
    sampleRate: obj['global']['core:sample_rate'] / 1e6, // in MHz
    dataType: obj['global']['core:datatype']
      .replace('c', 'complex\n')
      .replace('r', 'real\n')
      .replace('f', 'float\n')
      .replace('i', 'signed int\n')
      .replace('u', 'unsigned int\n')
      .replace('8', '8 bits')
      .replace('16', '16 bits')
      .replace('32', '32 bits')
      .replace('64', '64 bits')
      .replace('_le', ''),
    frequency: obj['captures'][0]['core:frequency'] / 1e6, // in MHz
    annotations: obj['annotations'],
    numberOfAnnotation: obj['annotations'].length,
    author: author,
    email: email,
    type: 'file',
    thumbnailUrl: baseUrl + fName + '.png',
  };
}
export const FetchRecordingsList = (connection) => async (dispatch) => {
  dispatch(fetchRecordingsListLoading());

  // this happens when its a local folder being opened
  if ('entries' in connection) {
    dispatch(fetchRecordingsListSuccess(connection.entries));
  }

  const { accountName, containerName, sasToken } = connection;
  const baseUrl = `https://${accountName}.blob.core.windows.net/${containerName}/`;
  const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // List the blob(s) in the container.
  const entries = [];
  try {
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
  } catch (error) {
    dispatch(fetchRecordingsListFailure(error));
  }
  //console.log(entries);
  dispatch(fetchRecordingsListSuccess(entries));
};
