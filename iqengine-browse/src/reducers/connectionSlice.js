// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSlice } from '@reduxjs/toolkit';

export const connectionSlice = createSlice({
  name: 'connection',
  initialState: {
    accountName: '',
    containerName: '',
    sasToken: '',
    recording: '',
    metafilehandle: '',
    datafilehandle: '',
  },
  reducers: {
    updateAccountName: (state, action) => {
      state.accountName = action.payload;
    },
    updateContainerName: (state, action) => {
      state.containerName = action.payload;
    },
    updateSasToken: (state, action) => {
      state.sasToken = action.payload;
    },
    updateRecording: (state, action) => {
      state.recording = action.payload;
    },
    updateMetaFileHandle: (state, action) => {
      state.metafilehandle = action.payload;
    },
    updateDataFileHandle: (state, action) => {
      state.datafilehandle = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAccountName, updateContainerName, updateSasToken, updateRecording, updateMetaFileHandle, updateDataFileHandle } = connectionSlice.actions;

export default connectionSlice.reducer;