// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useSelector } from 'react-redux'
import { select_fft } from '../selector'
//import { fetchMoreData } from '../features/blob/blobSlice'
//import { selectFftSize } from '../features/fft/fftSlice'
import React, { useRef } from 'react'
//import './spectrogram-viewer.css'; // Tell webpack that Button.js uses these styles

const SpectrogramViewer = (props) => {
    let select_fft_return = useSelector(state => select_fft(state));
    //const dispatch = useDispatch();
    const canvasRef = useRef(null)
    const canvas = canvasRef.current
    //const canvasRulerRef = useRef(null)
    //const canvas2 = canvasRulerRef.current
    if (canvas && select_fft_return) {
        const context = canvas.getContext('2d')
        const spectrogram_width_scale  =  select_fft_return.image_data ? props.spectrogram_width/select_fft_return.image_data.width : 1;
        const spectrogram_width = Math.floor(select_fft_return.image_data.width * spectrogram_width_scale);

        canvas.setAttribute('width', spectrogram_width + props.timescale_width + props.text_width); // reset canvas pixels width
        canvas.setAttribute('height', props.upper_tick_height + select_fft_return.image_data.height); // don't use style for this

        // Draw the spectrogram

        createImageBitmap(select_fft_return.image_data).then(renderer =>
            {
                context.drawImage(renderer, 0, props.upper_tick_height, spectrogram_width, select_fft_return.image_data.height);

            });

        //context.putImageData(select_fft_return.image_data, 0, 0,0,0, select_fft_return.image_data.width*2,select_fft_return.image_data.height);
        //let clearImgData = new ImageData(select_fft_return.image_data, lines, pxPerLine);
    }
    //this.offScreenCvs =  cvs;
    return <canvas ref={canvasRef} style={{
        gridRow: '1',
        gridColumn: '1',
        zIndex: '1',
      }}></canvas>

}

export {SpectrogramViewer};
