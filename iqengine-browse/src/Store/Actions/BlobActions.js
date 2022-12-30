import {
  FETCH_MORE_DATA_FAILURE,
  FETCH_MORE_DATA_LOADING,
  FETCH_MORE_DATA_SUCCESS,
  UPDATE_BLOB_SIZE,
  UPDATE_BLOB_TAPS,
} from '../../Constants/BlobTypes';
import FetchMoreData from '../../Sources/FetchMoreDataSource';

export const updateBlobTaps = (payload) => ({
  type: UPDATE_BLOB_TAPS,
  payload,
});

export const updateBlobSize = (payload) => ({
  type: UPDATE_BLOB_SIZE,
  payload,
});

export const fetchMoreDataLoading = (_) => ({
  type: FETCH_MORE_DATA_LOADING,
});

export const fetchMoreDataSuccess = (payload) => ({
  type: FETCH_MORE_DATA_SUCCESS,
  payload,
});

export const fetchMoreDataFailure = (_) => ({
  type: FETCH_MORE_DATA_FAILURE,
});

export const initFetchMoreBlob = (args) => FetchMoreData(args);
