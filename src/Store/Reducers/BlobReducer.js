// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  FETCH_MORE_DATA_FAILURE,
  FETCH_MORE_DATA_LOADING,
  FETCH_MORE_DATA_SUCCESS,
  RESET_BLOB_OBJ,
  UPDATE_BLOB_SIZE,
  UPDATE_BLOB_TOTAL_BYTES,
  UPDATE_BLOB_TAPS,
} from '../../Constants/BlobTypes';

window.iq_data = []; // This is GROSS!!! but it works?! We need a cleaner way to store large binary data.

const initialState = {
  size: 0,
  totalBytes: 0,
  status: 'idle',
  taps: new Float32Array(1).fill(1),
};

export default function blobReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_BLOB_TAPS:
      return {
        ...state,
        taps: action.payload,
      };
    case UPDATE_BLOB_SIZE:
      return {
        ...state,
        size: action.payload,
      };
    case UPDATE_BLOB_TOTAL_BYTES:
      return {
        ...state,
        totalBytes: action.payload,
      };
    case FETCH_MORE_DATA_LOADING: // FetchMoreData/pending, where FetchMoreData is the async thunk function
      return {
        ...state,
        status: 'loading',
      };
    case FETCH_MORE_DATA_SUCCESS: // FetchMoreData/fulfilled, where FetchMoreData is the async thunk function
      let size = window.iq_data.length + action.payload.samples.length; // Don't use byte length because the new array has to be specified by the num of elements not bytes
      // Copy existing IQ samples to new_iq_data, then append the new IQ samples, then save it back to window.iq_data
      let new_iq_data;
      // TODO: would be nice to get rid of window.data_type and just have it only stored in meta
      if (action.payload.data_type === 'ci16_le') {
        new_iq_data = new Int16Array(size);
      } else if (action.payload.data_type === 'cf32_le') {
        new_iq_data = new Float32Array(size);
      } else {
        console.error('unsupported data_type');
        new_iq_data = new Int16Array(size);
      }
      new_iq_data.set(window.iq_data, 0); // 2nd arg of set() is the offset into the target array at which to begin writing values from the source array
      new_iq_data.set(action.payload.samples, window.iq_data.length); // see above comment.  units are elements, not bytes!
      window.iq_data = new_iq_data;
      // window.iq_data = [].concat(window.iq_data, action.payload); // adds new samples to iq_data.  works as long as we only grab <=100k samples at a time (call stack limit)
      return {
        ...state,
        status: 'idle',
        size: size,
      };
    case FETCH_MORE_DATA_FAILURE: // FetchMoreData/rejected, where FetchMoreData is the async thunk function
      return {
        ...state,
        status: 'error',
      };
    case RESET_BLOB_OBJ:
      return initialState;
    default:
      return {
        ...state,
      };
  }
}
