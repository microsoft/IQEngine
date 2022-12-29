// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { select_fft } from '../../Utils/selector';
import React, { useRef } from 'react';

const AnnotationViewer = (props) => {
  let select_fft_return = select_fft(props);

  const canvasAnnotationRef = useRef(null);
  const canvas = canvasAnnotationRef.current;
  if (canvas && select_fft_return) {
    //console.log("Generating annotations", select_fft_return.fft_size)
    const context = canvas.getContext('2d');

    const spectrogram_width_scale = select_fft_return.image_data ? props.spectrogram_width / select_fft_return.image_data.width : 1;
    const spectrogram_width = Math.floor(select_fft_return.image_data.width * spectrogram_width_scale);
    const timescale_width = props.timescale_width;
    const text_width = props.text_width;
    const upper_tick_height = props.upper_tick_height;
    canvas.setAttribute('width', spectrogram_width + timescale_width + text_width); // reset canvas pixels width
    canvas.setAttribute('height', select_fft_return.image_data.height); // don't use style for this

    // Draw the spectrogram

    // Draw any rectangles from annotations
    for (let i = 0; i < select_fft_return.annotations.length; i++) {
      //console.log(select_fft_return.annotations[i]);
      context.beginPath();
      context.lineWidth = '4';
      context.strokeStyle = 'black';
      //context.rect(select_fft_return.annotations[i].x , select_fft_return.annotations[i].y, select_fft_return.annotations[i].width, select_fft_return.annotations[i].height);
      context.rect(select_fft_return.annotations[i].x * spectrogram_width_scale * select_fft_return.fft_size, (select_fft_return.annotations[i].y * 2) / select_fft_return.fft_size + upper_tick_height, select_fft_return.annotations[i].width * spectrogram_width_scale * select_fft_return.fft_size, (select_fft_return.annotations[i].height * 2) / select_fft_return.fft_size);
      // add the label
      context.font = 'bold 28px serif';
      context.fillText(select_fft_return.annotations[i].description, select_fft_return.annotations[i].x * spectrogram_width_scale * select_fft_return.fft_size, (select_fft_return.annotations[i].y * 2) / select_fft_return.fft_size + upper_tick_height - 5);
      context.stroke();
    }

    // Draw the vertical scales
    var ticks = select_fft_return.image_data.height / 10;
    context.font = '16px serif';
    const font_height = context.measureText('100').actualBoundingBoxAscent;
    //const max_txt_width = context.measureText("100").width;
    let time_per_row = select_fft_return.fft_size / select_fft_return.sample_rate;
    for (let i = 0; i < ticks; i++) {
      context.beginPath();
      context.lineWidth = '1';
      context.strokeStyle = 'white';
      context.moveTo(spectrogram_width + 5, upper_tick_height + i * 10);
      if (i % 10 === 0) {
        context.lineTo(spectrogram_width + timescale_width, upper_tick_height + i * 10);
        context.fillStyle = '#FFFFFF'; // font color
        context.fillText((i * time_per_row * 10 * 1e3).toString(), spectrogram_width + 22, upper_tick_height + i * 10 + font_height / 2); // in ms
      } else {
        context.lineTo(spectrogram_width + timescale_width - 10, i * 10 + upper_tick_height);
      }

      context.stroke();
    }

    //context.putImageData(select_fft_return.image_data, 0, 0,0,0, select_fft_return.image_data.width*2,select_fft_return.image_data.height);
    //let clearImgData = new ImageData(select_fft_return.image_data, lines, pxPerLine);
  }
  //this.offScreenCvs =  cvs;
  return (
    <canvas
      ref={canvasAnnotationRef}
      style={{
        gridRow: '1',
        gridColumn: '1',
        zIndex: '2',
      }}
    ></canvas>
  );
};

export { AnnotationViewer };
