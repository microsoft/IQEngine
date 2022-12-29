import { connect } from "react-redux";
import SpectrogramPage from "../Components/Spectrogram/SpectrogramPage";
import {
    updateConnectionAccountName,
    updateConnectionContainerName,
    updateConnectionSasToken,
    updateConnectionMetaFileHandle,
    updateConnectionDataFileHandle,
    updateConnectionRecording
} from "../Store/Actions/ConnectionActions";
import { initFetchMoreBlob, updateBlobTaps } from "../Store/Actions/BlobActions";
import { fetchMetaDataBlob } from '../Store/Actions/FetchMetaActions';

function mapStateToProps(state) {
    const { connectionReducer, blobReducer, fetchMetaReducer } = state;
    return {
        connection: { ...connectionReducer },
        blob: { ...blobReducer },
        meta: {...fetchMetaReducer}
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateConnectionAccountName: accountName => dispatch(updateConnectionAccountName(accountName)),
        updateConnectionContainerName: containerName => dispatch(updateConnectionContainerName(containerName)),
        updateConnectionSasToken: token => dispatch(updateConnectionSasToken(token)),
        updateConnectionMetaFileHandle: handle => dispatch(updateConnectionMetaFileHandle(handle)),
        updateConnectionDataFileHandle: handle => dispatch(updateConnectionDataFileHandle(handle)),
        updateConnectionRecording: recording => dispatch(updateConnectionRecording(recording)),
        updateBlobTaps: taps => dispatch(updateBlobTaps(taps)),
        initFetchMoreBlob: args => dispatch(initFetchMoreBlob(args)),
        fetchMetaDataBlob: connection => dispatch(fetchMetaDataBlob(connection)),
    };
}

const SpectrogramContainer = connect(mapStateToProps, mapDispatchToProps)(SpectrogramPage);

export default SpectrogramContainer