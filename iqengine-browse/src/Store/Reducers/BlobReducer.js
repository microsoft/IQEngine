// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  FETCH_MORE_DATA_FAILURE,
  FETCH_MORE_DATA_LOADING,
  FETCH_MORE_DATA_SUCCESS,
  RESET_BLOB_OBJ,
  UPDATE_BLOB_SIZE,
  UPDATE_BLOB_TAPS,
} from '../../Constants/BlobTypes';

window.iq_data = []; // This is GROSS!!! but it works?! We need a cleaner way to store large binary data.

const initialState = {
  size: 0,
  status: 'idle',
  taps: new Float32Array(1).fill(1),
};

const fetchMoreDataSuccessUpdates = (action) => {
  let size = window.iq_data.length + action.payload.length; // Don't use byte length because the new array has to be specified by the num of elements not bytes

  let new_iq_data;
  if (window.data_type === 'ci16_le') {
    new_iq_data = new Int16Array(size);
  } else if (window.data_type === 'cf32_le') {
    new_iq_data = new Float32Array(size);
  } else {
    console.error('unsupported data_type');
    new_iq_data = new Int16Array(size);
  }

  // Copy existing IQ samples to new_iq_data, then append the new IQ samples, then save it back to window.iq_data
  new_iq_data.set(window.iq_data, 0); // 2nd arg of set() is the offset into the target array at which to begin writing values from the source array
  new_iq_data.set(action.payload, window.iq_data.length); // see above comment.  units are elements, not bytes!
  window.iq_data = new_iq_data;
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
    case FETCH_MORE_DATA_LOADING:
      return {
        ...state,
        status: 'loading',
      };
    case FETCH_MORE_DATA_SUCCESS:
      const size = window.iq_data.length + action.payload.length;
      fetchMoreDataSuccessUpdates(action);
      return {
        ...state,
        status: 'idle',
        size: size,
      };
    case FETCH_MORE_DATA_FAILURE:
      return {
        ...state,
        status: 'error',
      };
    case RESET_BLOB_OBJ:
      return {
        size: 0,
        status: 'idle',
        taps: new Float32Array(1).fill(1),
      };
    default:
      return {
        ...state,
      };
  }
}
