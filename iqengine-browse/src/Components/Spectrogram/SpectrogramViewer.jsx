// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { select_fft } from '../../Utils/selector';
import React, { useRef } from 'react';

const SpectrogramViewer = (props) => {
  let select_fft_return = select_fft(props); // select_fft_return.image_data grows each time we grab more samples
  //const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const canvas = canvasRef.current;
  //const canvasRulerRef = useRef(null)
  //const canvas2 = canvasRulerRef.current
  if (canvas && select_fft_return) {
    const context = canvas.getContext('2d');
    const spectrogram_width_scale = select_fft_return.image_data ? props.spectrogram_width / select_fft_return.image_data.width : 1;
    const spectrogram_width = Math.floor(select_fft_return.image_data.width * spectrogram_width_scale);

    canvas.setAttribute('width', spectrogram_width + props.timescale_width + props.text_width); // reset canvas pixels width
    canvas.setAttribute('height', props.upper_tick_height + select_fft_return.image_data.height); // don't use style for this

    // Draw the spectrogram
    console.log("drawing")
    createImageBitmap(select_fft_return.image_data).then((renderer) => {
      context.drawImage(renderer, 0, props.upper_tick_height, spectrogram_width, select_fft_return.image_data.height);
    });

    //context.putImageData(select_fft_return.image_data, 0, 0,0,0, select_fft_return.image_data.width*2,select_fft_return.image_data.height);
    //let clearImgData = new ImageData(select_fft_return.image_data, lines, pxPerLine);
  }
  //this.offScreenCvs =  cvs;
  return (
    <canvas
      ref={canvasRef}
      style={{
        gridRow: '1',
        gridColumn: '1',
        zIndex: '1',
      }}
    ></canvas>
  );
};

export { SpectrogramViewer };
