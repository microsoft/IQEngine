// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { UPDATE_FFT_MAGNITUDE_MAX, UPDATE_FFT_MAGNITUDE_MIN, UPDATE_FFT_SIZE } from '../../Constants/FFTTypes';

const initialState = {
  size: 1024,
  magnitudeMax: 255,
  magnitudeMin: 30,
};

export default function fftReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_FFT_SIZE:
      return {
        ...state,
        size: action.payload,
      };
    case UPDATE_FFT_MAGNITUDE_MAX:
      return {
        ...state,
        magnitudeMax: action.payload,
      };
    case UPDATE_FFT_MAGNITUDE_MIN:
      return {
        ...state,
        magnitudeMin: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
}