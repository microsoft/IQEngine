import { connect } from 'react-redux';
import {
  updateConnectionMetaFileHandle,
  updateConnectionDataFileHandle,
  updateConnectionRecording,
} from '../Store/Actions/ConnectionActions';
import RecordingsBrowser from '../Components/RecordingsBrowser';

function mapStateToProps(state) {
  const { recordingsListReducer } = state;
  return {
    recording: { ...recordingsListReducer },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateConnectionMetaFileHandle: (handle) => dispatch(updateConnectionMetaFileHandle(handle)),
    updateConnectionDataFileHandle: (handle) => dispatch(updateConnectionDataFileHandle(handle)),
    updateConnectionRecording: (recording) => dispatch(updateConnectionRecording(recording)),
  };
}

const RecordingsListContainer = connect(mapStateToProps, mapDispatchToProps)(RecordingsBrowser);

export default RecordingsListContainer;
