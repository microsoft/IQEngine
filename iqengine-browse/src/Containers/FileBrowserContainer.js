import { connect } from 'react-redux';
import FileBrowser from '../Components/FileBrowser/FileBrowser';
import {
  updateConnectionAccountName,
  updateConnectionContainerName,
  updateConnectionSasToken,
  updateConnectionMetaFileHandle,
  updateConnectionDataFileHandle,
  updateConnectionRecording,
} from '../Store/Actions/ConnectionActions';

function mapStateToProps(state) {
  const { connectionReducer } = state;
  return {
    ...connectionReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateConnectionAccountName: (accountName) => dispatch(updateConnectionAccountName(accountName)),
    updateConnectionContainerName: (containerName) => dispatch(updateConnectionContainerName(containerName)),
    updateConnectionSasToken: (token) => dispatch(updateConnectionSasToken(token)),
    updateConnectionMetaFileHandle: (handle) => dispatch(updateConnectionMetaFileHandle(handle)),
    updateConnectionDataFileHandle: (handle) => dispatch(updateConnectionDataFileHandle(handle)),
    updateConnectionRecording: (recording) => dispatch(updateConnectionRecording(recording)),
  };
}

const FileBrowserContainer = connect(mapStateToProps, mapDispatchToProps)(FileBrowser);

export default FileBrowserContainer;
