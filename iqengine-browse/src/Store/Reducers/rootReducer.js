import { combineReducers } from '@reduxjs/toolkit';
import blobReducer from './BlobReducer';
import fftReducer from './FFTReducer';
import connectionReducer from './ConnectionReducer';
import fetchMetaReducer from './FetchMetaReducer';


const rootReducer = combineReducers({
  blobReducer,
  connectionReducer,
  fftReducer,
  fetchMetaReducer,
});

export default rootReducer;