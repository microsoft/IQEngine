// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { select_fft } from '../../Utils/selector';
import React, { useState, useEffect } from 'react';
import { Layer, Rect, Text } from 'react-konva';

const AnnotationViewer = (props) => {
  let { blob, fft, meta, windowFunction, spectrogram_width, upper_tick_height } = props;

  const [fftSize, setFftSize] = useState();
  const [spectrogramWidthScale, setSpectrogramWidthScale] = useState();
  const [annotations, setAnnotations] = useState([]);
  const [ticks, setTicks] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    let ret = select_fft(blob, fft, meta);
    if (!ret) {
      return;
    }
    setAnnotations(ret.annotations);
    setFftSize(ret.fft_size);
    setSpectrogramWidthScale(ret.image_data ? props.spectrogram_width / ret.image_data.width : 1);
    //const spectrogram_width = Math.floor(select_fft_return.image_data.width * spectrogram_width_scale);
    //const width = spectrogram_width + timescale_width + text_width;
    //const height = select_fft_return.image_data.height; // don't use style for this

    // Draw the vertical scales
    let num_ticks = ret.image_data.height / 10;
    //const font_height = context.measureText('100').actualBoundingBoxAscent;
    const font_height = 10;
    //const max_txt_width = context.measureText("100").width;
    const timescale_width = 20;
    let time_per_row = ret.fft_size / ret.sample_rate;
    const temp_ticks = [];
    const temp_labels = [];
    for (let i = 0; i < num_ticks; i++) {
      if (i % 10 === 0) {
        temp_ticks.push({ x: spectrogram_width + timescale_width, y: upper_tick_height + i * 10, width: 5, height: 0 });
        temp_labels.push({
          text: (i * time_per_row * 10 * 1e3).toString(),
          x: spectrogram_width + 22,
          y: upper_tick_height + i * 10 + font_height / 2,
        }); // in ms
      } else {
        temp_ticks.push({ x: spectrogram_width + timescale_width - 10, y: upper_tick_height + i * 10, width: 5, height: 0 });
      }
    }
    setTicks(temp_ticks);
    setLabels(temp_labels);
  }, [blob, fft, meta, spectrogram_width, windowFunction]);

  if (annotations.length <= 1) {
    return <></>;
  }

  return (
    <Layer>
      {annotations.map((annotation, index) => (
        // for params of Rect see https://konvajs.org/api/Konva.Rect.html
        // for Text params see https://konvajs.org/api/Konva.Text.html
        <>
          <Rect
            x={annotation.x * spectrogramWidthScale * fftSize}
            y={(annotation.y * 2) / fftSize + upper_tick_height}
            width={annotation.width * spectrogramWidthScale * fftSize}
            height={(annotation.height * 2) / fftSize}
            fillEnabled="false"
            stroke="black"
            strokeWidth={4}
            key={index}
          />
          <Text
            text={annotation.description}
            fontFamily="serif"
            fontSize="20"
            x={annotation.x * spectrogramWidthScale * fftSize}
            y={(annotation.y * 2) / fftSize + upper_tick_height - 20}
            stroke="black"
            key={index + 1000000}
          />
        </>
      ))}
      {ticks.map((tick, index) => (
        // couldnt get Line to work, kept getting NaN errors, so just using Rect instead
        <Rect x={tick.x} y={tick.y} width={tick.width} height={tick.height} fillEnabled="false" stroke="white" strokeWidth={1} key={index} />
      ))}
      {labels.map((label, index) => (
        // for Text params see https://konvajs.org/api/Konva.Text.html
        <Text text={label.text} fontFamily="serif" fontSize="16" x={label.x} y={label.y} stroke="white" key={index} />
      ))}
    </Layer>
  );
};

export { AnnotationViewer };
