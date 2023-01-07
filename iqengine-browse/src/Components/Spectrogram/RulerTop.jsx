// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { select_fft } from '../../Utils/selector';
import React, { useState, useEffect } from 'react';
import { Layer, Rect, Text } from 'react-konva';

const RulerTop = (props) => {
  let { blob, fft, meta, windowFunction, spectrogram_width } = props;

  const [ticks, setTicks] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    let select_fft_return = select_fft(blob, fft, meta);
    if (select_fft_return) {
      const spectrogram_width_scale = spectrogram_width / select_fft_return.image_data.width;
      const num_ticks = 16;
      //const font_height = context.measureText('100').actualBoundingBoxAscent;
      const font_height = 10;
      const temp_ticks = [];
      const temp_labels = [];
      for (let i = 0; i <= num_ticks; i++) {
        if (i % (num_ticks / 4) === 0) {
          const text = (((i / num_ticks) * select_fft_return.sample_rate - select_fft_return.sample_rate / 2) / 1e6).toString();
          //const txt_width = context.measureText(text).width;
          const txt_width = 15; // just manually setting this for now
          temp_labels.push({ text: text, x: (select_fft_return.fft_size / num_ticks) * i * spectrogram_width_scale - txt_width / 2, y: font_height }); // in ms
          temp_ticks.push({ x: (select_fft_return.fft_size / num_ticks) * i * spectrogram_width_scale, y: 0, width: 0, height: 4 });
        } else {
          temp_ticks.push({ x: (select_fft_return.fft_size / num_ticks) * i * spectrogram_width_scale, y: 0, width: 0, height: 10 });
        }
      }
      setTicks(temp_ticks);
      setLabels(temp_labels);
    }
  }, [blob, fft, meta, spectrogram_width, windowFunction]);
  console.log(ticks);
  if (ticks.length > 1) {
    return (
      <Layer>
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
  } else {
    return <></>;
  }
};

export { RulerTop };
