// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { select_fft } from '../../Utils/selector';
import React, { useRef, Component } from 'react';
import { Stage, Layer, Rect, Circle, Image, FastLayer } from 'react-konva';

class SpectrogramViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageObj: 0,
      blob: props.blob,
      fft: props.fft,
      meta: props.meta,
      spectrogram_width: props.spectrogram_width,
      upper_tick_height: props.upper_tick_height,
      spectrogram_width_scale: 0,
      height: 0,
    };
  }

  componentDidMount() {
    const { blob, fft, meta, spectrogram_width, spectrogram_width_scale } = this.state;

    let select_fft_return = select_fft(blob, fft, meta); // select_fft_return.image_data grows each time we grab more samples

    // at the start, select_fft doesn't actaully return anything because the data isnt ready yet
    if (!select_fft_return) {
      return;
    }

    this.setState({ height: select_fft_return.image_data.height });
    this.setState({ spectrogram_width_scale: select_fft_return.image_data ? spectrogram_width / select_fft_return.image_data.width : 1 });
    this.setState({ spectrogram_width: Math.floor(select_fft_return.image_data.width * spectrogram_width_scale) });
    //canvas.setAttribute('width', spectrogram_width + props.timescale_width + props.text_width); // reset canvas pixels width
    //canvas.setAttribute('height', props.upper_tick_height + select_fft_return.image_data.height); // don't use style for this

    createImageBitmap(select_fft_return.image_data).then((ret) => {
      this.setState({ imageObj: ret });
    });
  }

  static getDerivedStateFromProps(props, state) {
    let newState = state;
    if (props.blob.size !== state.blob.size) {
      newState.blob.size = props.blob.size;
    }
    if (props.fft !== state.fft) {
      newState.fft = props.fft;
    }
    if (props.spectrogram_width !== state.spectrogram_width) {
      newState.spectrogram_width = props.spectrogram_width;
    }
    if (props.upper_tick_height !== state.upper_tick_height) {
      newState.upper_tick_height = props.upper_tick_height;
    }
    return { ...newState };
  }

  render() {
    const { spectrogram_width, upper_tick_height, imageObj, height } = this.state;

    if (!imageObj) {
      return <></>;
    }

    return (
      <Layer>
        <Image image={imageObj} x={0} y={upper_tick_height} width={spectrogram_width} height={height} />
      </Layer>
    );
  }
}

export { SpectrogramViewer };
