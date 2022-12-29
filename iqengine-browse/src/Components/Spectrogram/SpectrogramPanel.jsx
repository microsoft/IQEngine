// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SpectrogramViewer } from './SpectrogramViewer';
import { AnnotationViewer } from './AnnotationViewer';
import { RulerTop } from './RulerTop';
import React, { useEffect, useState } from 'react';

const SpectrogramPanel = (props) => {
  const [isBottom, setIsBottom] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });

  const timescale_width = 20;
  const text_width = 30;
  const upper_tick_height = 30;

  var spectrogram_width = dimensions.width - text_width - timescale_width;

  const checkSize = () => {
    const panel = document.getElementById('spectrogram-panel');
    setDimensions({
      width: panel.offsetWidth,
      height: panel.offsetHeight,
    });
  };

  let { initFetchMoreBlob, connection, blob } = props;
  let { size, status } = props.blob;

  useEffect(() => {
    // function has to be defined inside of the useEffect or else it throws a warning
    function handleScroll() {
      const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;

      if (!isBottom && scrollTop + window.innerHeight + 50 >= scrollHeight) {
        setIsBottom(true);
        console.log('Setting Scroll Bottom! Current Blobsize: ' + size);
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBottom, size]);

  useEffect(() => {
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    if (isBottom) {
      console.log('Fetching more Data! Current Blobsize: ' + size);
      blob.size = size;
      initFetchMoreBlob({connection:connection, blob:blob});
    }
  }, [isBottom, size, initFetchMoreBlob, blob, connection]);

  useEffect(() => {
    if (isBottom && status === 'idle') {
      console.log('Finished loading more DATA! - unsetting bottom - Current Blobsize: ' + size);
      setIsBottom(false);
    }
  }, [isBottom, status, size]);
  return (
    <div>
      <div id="spectrogram-panel" style={{ display: 'grid', position: 'relative' }}>
        <SpectrogramViewer
          timescale_width={timescale_width}
          text_width={text_width}
          upper_tick_height={upper_tick_height}
          spectrogram_width={spectrogram_width}
          fft={props.fft}
          meta={props.meta}
          blob={props.blob}
        />
        <AnnotationViewer
          timescale_width={timescale_width}
          text_width={text_width}
          upper_tick_height={upper_tick_height}
          spectrogram_width={spectrogram_width}
          fft={props.fft}
          meta={props.meta}
          blob={props.blob}
        />
        <RulerTop
          timescale_width={timescale_width}
          text_width={text_width}
          upper_tick_height={upper_tick_height}
          spectrogram_width={spectrogram_width}
          fft={props.fft}
          meta={props.meta}
          blob={props.blob}
        />
      </div>
    </div>
  );
};

export { SpectrogramPanel };
