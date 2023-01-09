// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { fftshift } from 'fftshift';
import { colMap } from './colormap';

const FFT = require('fft.js');

/* hmmm.... one problem with only incrementally generating the FFT is that if the FFT Size or Magnitude Divider chagne, you need to re-create the whole thing
if the blob size changes, you only need to add on the new stuff. I think the solution is to build my own fancy selector with built in memoization stuff. */

let previous_blob_size = 0;
let previous_fft_size = 0;
let previous_magnitude_max = 0;
let previous_magnitude_min = 0;
window.fft_data = new Uint8ClampedArray(); // this is where our FFT outputs are stored
window.annotations = []; // gets filled in before return
window.sample_rate = 1; // will get filled in

// This will get called when we go to a new spectrogram page
export const clear_fft_data = () => {
  previous_blob_size = 0;
  previous_fft_size = 0;
  previous_magnitude_max = 0;
  previous_magnitude_min = 0;
  window.fft_data = new Uint8ClampedArray(); // this is where our FFT outputs are stored
  window.annotations = []; // gets filled in before return
  window.sample_rate = 1; // will get filled in
  window.iq_data = []; // initialized in blobSlice.js but we have to clear it each time we go to another spectrogram page
};

export const select_fft = (blob, fft, meta, windowFunction) => {
  let blob_size = window.iq_data.length; // this is actually the number of int16's that have been downloaded so far
  let fft_size = fft.size;
  let magnitude_max = fft.magnitudeMax;
  let magnitude_min = fft.magnitudeMin;
  let num_ffts = Math.floor(blob_size / fft_size / 2); // divide by 2 because this is number of ints/floats not IQ samples

  let startTime = performance.now();

  // has there been any changes since we last rendered the FFT?  if not just return the existing fft_data
  if (
    !(
      blob_size !== previous_blob_size ||
      fft_size !== previous_fft_size ||
      magnitude_min !== previous_magnitude_min ||
      magnitude_max !== previous_magnitude_max
    )
  ) {
    let select_fft_return = {
      image_data: new ImageData(window.fft_data, fft_size, num_ffts),
      annotations: window.annotations,
      sample_rate: window.sample_rate,
      fft_size: fft_size, // scales will break without this
    };
    return select_fft_return;
  }

  // ...otherwise render the new portion
  let starting_row = 0;
  if (num_ffts === 0) {
    return null;
  }
  const clearBuf = new ArrayBuffer(fft_size * num_ffts * 4); // fills with 0s ie. rgba 0,0,0,0 = transparent
  let new_fft_data = new Uint8ClampedArray(clearBuf);
  let startOfs = 0;

  // if only the blob size changed, none of the other params, then initialize the direction and first line position
  if (fft_size === previous_fft_size && magnitude_min === previous_magnitude_min && magnitude_max === previous_magnitude_max) {
    starting_row = Math.floor(previous_blob_size / fft_size / 2);
    new_fft_data.set(window.fft_data, 0);
  }

  // loop through each row
  for (let i = starting_row; i < num_ffts; i++) {
    let samples_slice = window.iq_data.slice(i * fft_size * 2, (i + 1) * fft_size * 2); // mult by 2 because this is int/floats not IQ samples

    // Apply a hamming window and hanning window
    if (windowFunction === 'hamming') {
      for (let window_i = 0; window_i < fft_size; window_i++) {
        samples_slice[window_i] = samples_slice[window_i] * (0.54 - 0.46 * Math.cos((2 * Math.PI * window_i) / (fft_size - 1)));
      }
    } else if (windowFunction === 'hanning') {
      for (let window_i = 0; window_i < fft_size; window_i++) {
        samples_slice[window_i] = samples_slice[window_i] * (0.50 - 0.50 * Math.cos((2 * Math.PI * window_i) / (fft_size - 1)));
      }
    } else if (windowFunction === 'bartlett') {
      for (let window_i = 0; window_i < fft_size; window_i++) {
        samples_slice[window_i] = samples_slice[window_i] * ((2 / (fft_size - 1)) * (((fft_size - 1) / 2)) - Math.abs(window_i - ((fft_size - 1) / 2)));
      }
    } else if (windowFunction === 'blackman') {
      for (let window_i = 0; window_i < fft_size; window_i++) {
        samples_slice[window_i] = samples_slice[window_i] * (0.42 - 0.5 * Math.cos((2 * Math.PI * window_i) / fft_size) + 0.08 * Math.cos((4 * Math.PI * window_i) / fft_size));
      }
    }
  

    const f = new FFT(fft_size);
    const out = f.createComplexArray(); // creates an empty array the length of fft.size*2
    f.transform(out, samples_slice); // assumes input (2nd arg) is in form IQIQIQIQ and twice the length of fft.size
    let magnitudes = new Array(out.length / 2);
    for (let j = 0; j < out.length / 2; j++) {
      magnitudes[j] = Math.sqrt(Math.pow(out[j * 2], 2) + Math.pow(out[j * 2 + 1], 2)); // take magnitude
    }
    fftshift(magnitudes); // in-place

    // convert to dB
    magnitudes = magnitudes.map((x) => 10.0 * Math.log10(x));

    // convert to 0 - 255
    let minimum_val = Math.min(...magnitudes); // the ... tell it that its an array I guess
    magnitudes = magnitudes.map((x) => x - minimum_val); // lowest value is now 0
    let maximum_val = Math.max(...magnitudes);
    magnitudes = magnitudes.map((x) => x / maximum_val); // highest value is now 1
    magnitudes = magnitudes.map((x) => x * 255); // now from 0 to 255

    // apply magnitude min and max
    magnitudes = magnitudes.map((x) => x / ((magnitude_max - magnitude_min) / 255));
    magnitudes = magnitudes.map((x) => x - magnitude_min);

    // Clip from 0 to 255 and convert to ints
    magnitudes = magnitudes.map((x) => (x > 255 ? 255 : x)); // clip above 255
    magnitudes = magnitudes.map((x) => (x < 0 ? 0 : x)); // clip below 0
    let ipBuf8 = Uint8ClampedArray.from(magnitudes); // anything over 255 or below 0 at this point will become a random number
    let line_offset = i * fft_size * 4;
    for (let sigVal, rgba, opIdx = 0, ipIdx = startOfs; ipIdx < fft_size + startOfs; opIdx += 4, ipIdx++) {
      sigVal = ipBuf8[ipIdx] || 0; // if input line too short add zeros
      rgba = colMap[sigVal]; // array of rgba values
      // byte reverse so number aa bb gg rr
      new_fft_data[line_offset + opIdx] = rgba[0]; // red
      new_fft_data[line_offset + opIdx + 1] = rgba[1]; // green
      new_fft_data[line_offset + opIdx + 2] = rgba[2]; // blue
      new_fft_data[line_offset + opIdx + 3] = rgba[3]; // alpha
    }
  }
  let endTime = performance.now();
  console.log('Rendering spectrogram took', endTime - startTime, 'milliseconds'); // first cut of our code processed+rendered 0.5M samples in 760ms on marcs computer

  // Annotation portion
  let annotations_list = window.annotations;
  for (let i = 0; i < meta.annotations.length; i++) {
    let freq_lower_edge = meta.annotations[i]['core:freq_lower_edge'];
    let freq_upper_edge = meta.annotations[i]['core:freq_upper_edge'];
    let sample_start = meta.annotations[i]['core:sample_start'];
    let sample_count = meta.annotations[i]['core:sample_count'];
    let description = meta.annotations[i]['core:description'];

    // Calc the sample index of the first FFT being displayed
    let start_sample_index = previous_blob_size / 2; // blob size is in units of ints/floats that have been downloaded, and its two per sample
    let samples_in_window = (blob_size - previous_blob_size) / 2;
    let stop_sample_index = start_sample_index + samples_in_window;
    let center_frequency = meta.captures[0]['core:frequency'];
    let sample_rate = meta.global['core:sample_rate'];
    window.sample_rate = sample_rate;
    let lower_freq = center_frequency - sample_rate / 2;

    if (sample_start >= start_sample_index && sample_start < stop_sample_index) {
      annotations_list.push({
        x: (freq_lower_edge - lower_freq) / sample_rate,
        y: sample_start / 2, // divide by 2 is because sample start is in int/floats not IQ samples
        width: (freq_upper_edge - freq_lower_edge) / sample_rate,
        height: sample_count / 2,
        description: description,
      });
    }
  }
  window.annotations = annotations_list;

  previous_blob_size = blob_size;
  previous_fft_size = fft_size;
  previous_magnitude_max = magnitude_max;
  previous_magnitude_min = magnitude_min;
  window.fft_data = new_fft_data;

  let select_fft_return = {
    image_data: new ImageData(window.fft_data, fft_size, num_ffts),
    annotations: window.annotations,
    sample_rate: window.sample_rate,
  };
  return select_fft_return;
};
