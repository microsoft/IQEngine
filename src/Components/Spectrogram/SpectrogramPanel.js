// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SpectrogramViewer } from './SpectrogramViewer';
import { AnnotationViewer } from './AnnotationViewer';
import { RulerTop } from './RulerTop';
import React, { useEffect, useState, useRef } from 'react';
import { Stage } from 'react-konva';

const SpectrogramPanel = (props) => {
  const [isBottom, setIsBottom] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });
  const [stageDimensions, setStageDimensions] = useState({ stageWidth: 700, stageHeight: 700 });

  const timescale_width = 20;
  const text_width = 30;
  const upper_tick_height = 30;

  let spectrogram_width = dimensions.width - text_width - timescale_width;

  const stageRef = useRef(null);

  let { fetchMoreData, connection, blob, meta } = props;
  let { status } = props.blob;

  // hooks let you use state and other React features without writing a class, useEffect lets you perform side effects in function components
  useEffect(() => {
    // function has to be defined inside of the useEffect or else it throws a warning
    function handleScroll() {
      const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
      // This is the logic that detects being close to the bottom of the scroll range
      if (!isBottom && scrollTop + window.innerHeight + 50 >= scrollHeight) {
        setIsBottom(true);
        console.log('Setting Scroll Bottom!');
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBottom]);

  const checkSize = () => {
    const panel = document.getElementById('spectrogram-panel');
    setDimensions({
      width: panel.offsetWidth,
      height: panel.offsetHeight,
    });
  };

  // this one appears to happen once at the beginning but never again, even if you resize your window
  useEffect(() => {
    window.scrollTo(0, 0);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    if (isBottom && blob.status !== 'loading') {
      console.log('Fetching more Data!');
      // Call fetch more multiple times since it only grabs a few dozen rows each call
      fetchMoreData({ connection: connection, blob: blob, meta: meta });
    }
  }, [isBottom, fetchMoreData, blob, connection, meta]);

  useEffect(() => {
    if (isBottom && status === 'idle') {
      console.log('Finished loading more DATA! - unsetting bottom ');
      setIsBottom(false);
    }
  }, [isBottom, status]);

  return (
    <div>
      <div id="spectrogram-panel" style={{ display: 'grid', position: 'relative' }}>
        <Stage width={stageDimensions.stageWidth} height={stageDimensions.stageHeight} ref={stageRef}>
          <SpectrogramViewer
            timescale_width={timescale_width}
            text_width={text_width}
            upper_tick_height={upper_tick_height}
            spectrogram_width={spectrogram_width}
            fft={props.fft}
            meta={props.meta}
            blob={props.blob}
            windowFunction={props.window}
            setStageDimensions={setStageDimensions}
          />
          <AnnotationViewer
            timescale_width={timescale_width}
            text_width={text_width}
            upper_tick_height={upper_tick_height}
            spectrogram_width={spectrogram_width}
            fft={props.fft}
            meta={props.meta}
            blob={props.blob}
            stageRef={stageRef}
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
        </Stage>
      </div>
    </div>
  );
};

export { SpectrogramPanel };
