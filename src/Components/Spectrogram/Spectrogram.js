// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { select_fft } from '../../Utils/selector';
import React, { useState, useEffect, useRef } from 'react';
import { Layer, Image, Stage } from 'react-konva';
import useImage from 'use-image';

export const Spectrogram = (props) => {
  let { blob, fft, meta } = props;

  const stageRef = useRef(null);
  const [image] = useImage('https://konvajs.org/assets/lion.png');

  return (
    <Stage width={600} height={600} ref={stageRef}>
      <Layer>
        <Image image={image} x={0} y={0} width={600} height={600} />
      </Layer>
    </Stage>
  );
};
