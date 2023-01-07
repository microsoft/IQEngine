// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { select_fft } from '../../Utils/selector';
import React, { useRef, useState } from 'react';
import { Layer, Image } from 'react-konva';

export const SpectrogramViewer = (props) => {
  let { blob, fft, meta, windowFunction } = props;

  const [image, setImage] = useState();
  const [spectrogramWidth, setSpectrogramWidth] = useState(200);
  const [height, setHeight] = useState(200);

  let select_fft_return = select_fft(blob, fft, meta, windowFunction); // select_fft_return.image_data grows each time we grab more samples
  //const dispatch = useDispatch();
  //const canvasRef = useRef(null);
  //const canvas = canvasRef.current;
  //const canvasRulerRef = useRef(null)
  //const canvas2 = canvasRulerRef.current
  if (select_fft_return) {
    const spectrogram_width_scale = select_fft_return.image_data ? props.spectrogram_width / select_fft_return.image_data.width : 1;
    setSpectrogramWidth(Math.floor(select_fft_return.image_data.width * spectrogram_width_scale));
    setHeight(select_fft_return.image_data.height);
    //canvas.setAttribute('width', spectrogramWidth + props.timescale_width + props.text_width); // reset canvas pixels width
    //canvas.setAttribute('height', props.upper_tick_height + select_fft_return.image_data.height); // don't use style for this

    // Draw the spectrogram
    createImageBitmap(select_fft_return.image_data).then((ret) => {
      setImage(ret);
      //context.drawImage(renderer, 0, props.upper_tick_height, spectrogramWidth, select_fft_return.image_data.height);
    });

    //context.putImageData(select_fft_return.image_data, 0, 0,0,0, select_fft_return.image_data.width*2,select_fft_return.image_data.height);
    //let clearImgData = new ImageData(select_fft_return.image_data, lines, pxPerLine);
  }
  //this.offScreenCvs =  cvs;
  return (
    <Layer>
      <Image image={image} x={0} y={props.upper_tick_height} width={spectrogramWidth} height={height} />
    </Layer>
  );
};
