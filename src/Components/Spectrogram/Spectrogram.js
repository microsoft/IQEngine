import React, { useEffect, useState } from 'react';
import { Layer, Image, Stage } from 'react-konva';

const Spectrogram = (props) => {
  // purely for debugging, make sure we're getting the update...
  useEffect(() => {
    console.log(props.image);
  }, [props.image]);

  if (props.image) {
    return (
      <Stage width={600} height={600}>
        <Layer>
          <Image image={props.image} x={0} y={0} width={600} height={600} />
        </Layer>
      </Stage>
    );
  } else {
    return <> Move the scrollbar once </>;
  }
};

export default Spectrogram;
