import { connect } from 'react-redux';
import SpectrogramPage from '../Components/Spectrogram/SpectrogramPage';
import {
  updateConnectionAccountName,
  updateConnectionContainerName,
  updateConnectionSasToken,
  updateConnectionMetaFileHandle,
  updateConnectionDataFileHandle,
  updateConnectionRecording,
  updateConnectionBlobClient,
  resetConnection,
} from '../Store/Actions/ConnectionActions';
import { fetchMoreData, resetBlob, updateBlobTaps, updateBlobTotalBytes } from '../Store/Actions/BlobActions';
import { fetchMetaDataBlob, resetMeta } from '../Store/Actions/FetchMetaActions';

function mapStateToProps(state) {
  const { connectionReducer, blobReducer, fetchMetaReducer } = state;
  return {
    connection: { ...connectionReducer },
    blob: { ...blobReducer },
    meta: { ...fetchMetaReducer },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // The order of these dont matter, it's not actually calling the functions here
    updateConnectionAccountName: (accountName) => dispatch(updateConnectionAccountName(accountName)),
    updateConnectionContainerName: (containerName) => dispatch(updateConnectionContainerName(containerName)),
    updateConnectionSasToken: (token) => dispatch(updateConnectionSasToken(token)),
    updateConnectionMetaFileHandle: (handle) => dispatch(updateConnectionMetaFileHandle(handle)),
    updateConnectionDataFileHandle: (handle) => dispatch(updateConnectionDataFileHandle(handle)),
    updateConnectionRecording: (recording) => dispatch(updateConnectionRecording(recording)),
    updateConnectionBlobClient: (client) => dispatch(updateConnectionBlobClient(client)),
    updateBlobTaps: (taps) => dispatch(updateBlobTaps(taps)),
    updateBlobTotalBytes: (n) => dispatch(updateBlobTotalBytes(n)),
    fetchMoreData: (args) => dispatch(fetchMoreData(args)),
    fetchMetaDataBlob: (connection) => dispatch(fetchMetaDataBlob(connection)),
    resetConnection: () => dispatch(resetConnection()),
    resetMeta: () => dispatch(resetMeta()),
    resetBlob: () => dispatch(resetBlob()),
  };
}

const SpectrogramContainer = connect(mapStateToProps, mapDispatchToProps)(SpectrogramPage);

export default SpectrogramContainer;
