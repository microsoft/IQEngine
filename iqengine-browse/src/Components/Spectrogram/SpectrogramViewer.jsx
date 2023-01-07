// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { select_fft } from '../../Utils/selector';
import React, { useState, useEffect } from 'react';
import { Layer, Image } from 'react-konva';

export const SpectrogramViewer = (props) => {
  let { blob, fft, meta, windowFunction, spectrogram_width, setStageDimensions } = props;

  const [image, setImage] = useState();
  const [spectrogramWidth, setSpectrogramWidth] = useState(200);
  const [height, setHeight] = useState(200);

  useEffect(() => {
    let select_fft_return = select_fft(blob, fft, meta, windowFunction); // select_fft_return.image_data grows each time we grab more samples
    if (select_fft_return) {
      const spectrogram_width_scale = select_fft_return.image_data ? spectrogram_width / select_fft_return.image_data.width : 1;
      setSpectrogramWidth(Math.floor(select_fft_return.image_data.width * spectrogram_width_scale));
      setHeight(select_fft_return.image_data.height);
      setStageDimensions({
        stageWidth: spectrogramWidth + props.timescale_width + props.text_width,
        stageHeight: props.upper_tick_height + select_fft_return.image_data.height,
      });
      // Draw the spectrogram
      createImageBitmap(select_fft_return.image_data).then((ret) => {
        setImage(ret);
      });
    }
  }, [blob, fft, meta, spectrogram_width, windowFunction]);

  //this.offScreenCvs =  cvs;
  return (
    <Layer>
      <Image image={image} x={0} y={props.upper_tick_height} width={spectrogramWidth} height={height} />
    </Layer>
  );
};
