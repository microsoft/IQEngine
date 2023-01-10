// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { select_fft } from '../../Utils/selector';
import React, { useState, useEffect } from 'react';
import { Layer, Image } from 'react-konva';

export const SpectrogramViewer = (props) => {
  let {
    blob,
    fft,
    meta,
    windowFunction,
    spectrogram_width,
    setStageDimensions,
    text_width,
    timescale_width,
    upper_tick_height,
    autoscale,
    updateMagnitudeMax,
    updateMagnitudeMin,
    updateAutoScale,
  } = props;

  const [image, setImage] = useState();
  const [spectrogramWidth, setSpectrogramWidth] = useState(200);
  const [height, setHeight] = useState(200);

  useEffect(() => {
    let select_fft_return = select_fft(blob, fft, meta, windowFunction, autoscale); // select_fft_return.image_data grows each time we grab more samples
    if (select_fft_return) {
      const spectrogram_width_scale = select_fft_return.image_data ? spectrogram_width / select_fft_return.image_data.width : 1;
      setSpectrogramWidth(Math.floor(select_fft_return.image_data.width * spectrogram_width_scale));
      setHeight(select_fft_return.image_data.height);
      setStageDimensions({
        stageWidth: spectrogramWidth + timescale_width + text_width,
        stageHeight: upper_tick_height + select_fft_return.image_data.height,
      });
      // Draw the spectrogram
      createImageBitmap(select_fft_return.image_data).then((ret) => {
        setImage(ret);
      });
      if (autoscale && select_fft_return.autoMax) {
        updateAutoScale(); // toggles it off so this only will happen once
        updateMagnitudeMax(select_fft_return.autoMax);
        updateMagnitudeMin(select_fft_return.autoMin);
      }
    }
  }, [
    blob,
    fft,
    meta,
    spectrogram_width,
    windowFunction,
    text_width,
    timescale_width,
    setStageDimensions,
    spectrogramWidth,
    upper_tick_height,
    updateAutoScale,
    updateMagnitudeMax,
    updateMagnitudeMin,
    autoscale,
  ]);

  //this.offScreenCvs =  cvs;
  return (
    <Layer>
      <Image image={image} x={0} y={upper_tick_height} width={spectrogramWidth} height={height} />
    </Layer>
  );
};
