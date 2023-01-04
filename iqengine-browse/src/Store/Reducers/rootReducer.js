import { combineReducers } from '@reduxjs/toolkit';
import blobReducer from './BlobReducer';
import connectionReducer from './ConnectionReducer';
import fetchMetaReducer from './FetchMetaReducer';

const rootReducer = combineReducers({
  blobReducer,
  connectionReducer,
  fetchMetaReducer,
});

export default rootReducer;
