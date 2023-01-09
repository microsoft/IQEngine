// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { select_fft } from '../../Utils/selector';
import React, { useRef } from 'react';

const RulerTop = (props) => {
  let { blob, fft, meta } = props;

  let select_fft_return = select_fft(blob, fft, meta);

  const canvasRulerRef = useRef(null);
  const canvas = canvasRulerRef.current;
  if (canvas && select_fft_return) {
    const context = canvas.getContext('2d');

    const spectrogram_width_scale = props.spectrogram_width / select_fft_return.image_data.width;
    const spectrogram_width = Math.floor(select_fft_return.image_data.width * spectrogram_width_scale);
    const upper_tick_height = props.upper_tick_height;
    canvas.setAttribute('width', spectrogram_width + props.timescale_width + props.text_width); // reset canvas pixels width
    canvas.setAttribute('height', upper_tick_height); // don't use style for this

    // Draw the spectrogram
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    // Draw the horizontal scales
    const num_ticks = 16;
    context.font = '16px serif';
    context.fillStyle = 'white';
    const font_height = context.measureText('100').actualBoundingBoxAscent;
    for (let i = 0; i <= num_ticks; i++) {
      context.beginPath();
      context.lineWidth = '1';
      context.strokeStyle = 'white';
      if (i % (num_ticks / 4) === 0) {
        const txt = (((i / num_ticks) * select_fft_return.sample_rate - select_fft_return.sample_rate / 2) / 1e6).toString();
        const txt_width = context.measureText(txt).width;
        context.fillText(txt, (select_fft_return.fft_size / num_ticks) * i * spectrogram_width_scale - txt_width / 2, font_height); // in ms
        context.moveTo((select_fft_return.fft_size / num_ticks) * i * spectrogram_width_scale, font_height + 2);
        context.lineTo((select_fft_return.fft_size / num_ticks) * i * spectrogram_width_scale, upper_tick_height - 2);
      } else {
        context.moveTo((select_fft_return.fft_size / num_ticks) * i * spectrogram_width_scale, font_height + 10);
        context.lineTo((select_fft_return.fft_size / num_ticks) * i * spectrogram_width_scale, upper_tick_height - 2);
      }

      context.stroke();
    }

    //context.putImageData(select_fft_return.image_data, 0, 0,0,0, select_fft_return.image_data.width*2,select_fft_return.image_data.height);
    //let clearImgData = new ImageData(select_fft_return.image_data, lines, pxPerLine);
  }
  //this.offScreenCvs =  cvs;
  return (
    <canvas
      ref={canvasRulerRef}
      style={{
        position: 'sticky',
        top: 0,
        gridRow: '1',
        gridColumn: '1',
        zIndex: '9',
      }}
    ></canvas>
  );
};

export { RulerTop };
