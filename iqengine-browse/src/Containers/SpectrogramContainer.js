import { connect } from 'react-redux';
import Spectrogram from '../Components/Spectrogram/Spectrogram';
import {
  updateConnectionAccountName,
  updateConnectionContainerName,
  updateConnectionSasToken,
  updateConnectionMetaFileHandle,
  updateConnectionDataFileHandle,
  updateConnectionRecording,
  resetConnection,
} from '../Store/Actions/ConnectionActions';
import { fetchMoreData, resetBlob, updateBlobTaps } from '../Store/Actions/BlobActions';
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
    // I don't think the order of these matter, it's not actually calling the functions here, right?
    updateConnectionAccountName: (accountName) => dispatch(updateConnectionAccountName(accountName)),
    updateConnectionContainerName: (containerName) => dispatch(updateConnectionContainerName(containerName)),
    updateConnectionSasToken: (token) => dispatch(updateConnectionSasToken(token)),
    updateConnectionMetaFileHandle: (handle) => dispatch(updateConnectionMetaFileHandle(handle)),
    updateConnectionDataFileHandle: (handle) => dispatch(updateConnectionDataFileHandle(handle)),
    updateConnectionRecording: (recording) => dispatch(updateConnectionRecording(recording)),
    updateBlobTaps: (taps) => dispatch(updateBlobTaps(taps)),
    fetchMoreData: (args) => dispatch(fetchMoreData(args)),
    fetchMetaDataBlob: (connection) => dispatch(fetchMetaDataBlob(connection)),
    resetConnection: () => dispatch(resetConnection()),
    resetMeta: () => dispatch(resetMeta()),
    resetBlob: () => dispatch(resetBlob()),
  };
}

const SpectrogramContainer = connect(mapStateToProps, mapDispatchToProps)(Spectrogram);

export default SpectrogramContainer;
