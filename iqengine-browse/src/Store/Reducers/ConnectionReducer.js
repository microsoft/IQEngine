// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  RESET_CONNECTION_OBJ,
  UPDATE_CONNECTION_ACCOUNT_NAME,
  UPDATE_CONNECTION_CONTAINER_NAME,
  UPDATE_CONNECTION_DATA_FILE_HANDLE,
  UPDATE_CONNECTION_META_FILE_HANDLE,
  UPDATE_CONNECTION_RECORDING,
  UPDATE_CONNECTION_SAS_TOKEN,
} from '../../Constants/ConnectionTypes';
const initialState = {
  accountName: '',
  containerName: '',
  sasToken: '',
  recording: '',
  metafilehandle: '',
  datafilehandle: '',
};

export default function connectionReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CONNECTION_ACCOUNT_NAME:
      return {
        ...state,
        accountName: action.payload,
      };
    case UPDATE_CONNECTION_CONTAINER_NAME:
      return {
        ...state,
        containerName: action.payload,
      };
    case UPDATE_CONNECTION_RECORDING:
      return {
        ...state,
        recording: action.payload,
      };
    case UPDATE_CONNECTION_SAS_TOKEN:
      return {
        ...state,
        sasToken: action.payload,
      };
    case UPDATE_CONNECTION_META_FILE_HANDLE:
      return {
        ...state,
        metafilehandle: action.payload,
      };
    case UPDATE_CONNECTION_DATA_FILE_HANDLE:
      return {
        ...state,
        datafilehandle: action.payload,
      };
    case RESET_CONNECTION_OBJ:
      return {
        accountName: '',
        containerName: '',
        sasToken: '',
        recording: '',
        metafilehandle: '',
        datafilehandle: '',
      }
    default:
      return {
        ...state,
      };
  }
}
