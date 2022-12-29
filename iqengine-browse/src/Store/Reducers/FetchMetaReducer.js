// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RETURN_META_DATA_BLOB } from "../../Constants/MetaTypes";


const initialState = { annotations: [], captures: [], global: {} };

export default function fetchMetaReducer(state = initialState, action) {
  switch (action.type) {
    case RETURN_META_DATA_BLOB: {
      return {
        ...action.payload
      };
    }
    default:
      return state;
  }
}


