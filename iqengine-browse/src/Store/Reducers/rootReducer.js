import { combineReducers } from '@reduxjs/toolkit';
import blobReducer from './BlobReducer';
import connectionReducer from './ConnectionReducer';
import fetchMetaReducer from './FetchMetaReducer';
import recordingsListReducer from './RecordingsListReducer';

const rootReducer = combineReducers({
  blobReducer,
  connectionReducer,
  fetchMetaReducer,
  recordingsListReducer,
});

export default rootReducer;
