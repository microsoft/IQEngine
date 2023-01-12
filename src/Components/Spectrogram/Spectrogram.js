import React, { useEffect, useState, useRef } from 'react';
import { Layer, Image, Stage } from 'react-konva';
import { AnnotationViewer } from './AnnotationViewer';

const Spectrogram = (props) => {
  const stageRef = useRef(null);

  if (props.image) {
    return (
      <Stage width={600} height={600} stageRef={stageRef}>
        <Layer>
          <Image image={props.image} x={0} y={0} width={600} height={600} />
        </Layer>
        <AnnotationViewer
          timescale_width={20}
          text_width={10}
          upper_tick_height={0}
          spectrogram_width={600}
          fft={props.fft}
          meta={props.meta}
          blob={props.blob}
          stageRef={stageRef}
          annotations={props.annotations}
          spectrogramWidthScale={600 / props.fftSize}
          spectrogramHeightScale={1}
          fftSize={props.fftSize}
          sampleRate={props.sampleRate}
        />
      </Stage>
    );
  } else {
    return <> Move the scrollbar once </>;
  }
};

export default Spectrogram;
