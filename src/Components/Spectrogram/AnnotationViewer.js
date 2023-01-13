// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState, useEffect } from 'react';
import { Layer, Rect, Text, Circle } from 'react-konva';

const AnnotationViewer = (props) => {
  let { spectrogram_width, upper_tick_height, stageRef, spectrogramWidthScale, spectrogramHeightScale, fftSize, annotations, sampleRate } = props;

  const [ticks, setTicks] = useState([]);
  const [labels, setLabels] = useState([]);
  const [dragDropData, setDragDropData] = useState(null);

  // These two lines are a hack used to force a re-render when an annotation is updated, which for some reason wasnt updating
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    // Draw the vertical scales
    let num_ticks = 30;
    const timescale_width = 5;
    let time_per_row = fftSize / sampleRate;
    const temp_ticks = [];
    const temp_labels = [];
    for (let i = 0; i < num_ticks; i++) {
      if (i % 10 === 0) {
        temp_ticks.push({ x: spectrogram_width + timescale_width, y: upper_tick_height + i * 10, width: 15, height: 0 });
        temp_labels.push({
          text: (i * time_per_row * 10 * 1e3).toString(),
          x: spectrogram_width + 24,
          y: upper_tick_height + i * 10 - 7,
        }); // in ms
      } else {
        temp_ticks.push({ x: spectrogram_width + timescale_width, y: upper_tick_height + i * 10, width: 5, height: 0 });
      }
    }
    setTicks(temp_ticks);
    setLabels(temp_labels);
  }, [fftSize, sampleRate, spectrogram_width, upper_tick_height]);

  if (annotations.length <= 1) {
    return <></>;
  }

  function onDragStart(e, type) {
    console.log('drag start');
    //setDragDropData({ x: 0, y: 0, type });
    //e.target.classList.add('hide');
  }

  function onDragEnd(e) {
    /*
    const stage = stageRef.current;
    stage.setPointersPositions(e);
    const scale = stage.scaleX();
    const position = stage.getPointerPosition(); // this was returning NaNs but the example code had it working
    let x = (position.x - stage.x()) / scale;
    let y = (position.y - stage.y()) / scale;
    */
    const x = e.target.x(); // look at box coords instead of cursor coords because above code didnt work
    const y = e.target.y();
    const annot_indx = e.target.id().split('-')[0];
    const annot_pos_x = e.target.id().split('-')[1];
    const annot_pos_y = e.target.id().split('-')[2];
    annotations[annot_indx][annot_pos_x] = x / spectrogramWidthScale; // reverse the calcs done to generate the coords
    annotations[annot_indx][annot_pos_y] = y - upper_tick_height;
    forceUpdate(); // TODO remove the forceupdate and do it the proper way (possibly using spread?)
  }

  function onDrop(e) {
    console.log('dropped');
    e.preventDefault();
    setDragDropData(null);
  }

  // add cursor styling
  function onMouseOver() {
    document.body.style.cursor = 'move';
  }
  function onMouseOut() {
    document.body.style.cursor = 'default';
  }

  return (
    <Layer>
      {annotations.map((annotation, index) => (
        // for params of Rect see https://konvajs.org/api/Konva.Rect.html
        // for Text params see https://konvajs.org/api/Konva.Text.html
        <>
          {/* Main rectangle */}
          <Rect
            x={annotation.x1 * spectrogramWidthScale}
            y={(annotation.y1 + upper_tick_height) * spectrogramHeightScale}
            width={(annotation.x2 - annotation.x1) * spectrogramWidthScale}
            height={(annotation.y2 - annotation.y1) * spectrogramHeightScale}
            fillEnabled="false"
            stroke="black"
            strokeWidth={4}
            key={index}
          />
          {/* Top Left Corner */}
          <Rect
            x={annotation.x1 * spectrogramWidthScale - 4}
            y={annotation.y1 + upper_tick_height - 4}
            width={8}
            height={8}
            fillEnabled="true"
            fill="white"
            stroke="black"
            strokeWidth={1}
            key={index + 4000000}
            draggable
            onDragStart={(e) => onDragStart(e, 'rectangle')}
            onDragEnd={onDragEnd}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            id={index.toString() + '-x1-y1'} // tells the event which annotation, and which x and y to update
          />
          {/* Top Right Corner */}
          <Rect
            x={annotation.x2 * spectrogramWidthScale - 4}
            y={annotation.y1 + upper_tick_height - 4}
            width={8}
            height={8}
            fillEnabled="true"
            fill="white"
            stroke="black"
            strokeWidth={1}
            key={index + 5000000}
            draggable
            onDragStart={(e) => onDragStart(e, 'rectangle')}
            onDragEnd={onDragEnd}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            id={index.toString() + '-x2-y1'} // tells the event which annotation, and which x and y to update
          />
          {/* Bottom Left Corner */}
          <Rect
            x={annotation.x1 * spectrogramWidthScale - 4}
            y={annotation.y2 + upper_tick_height - 4}
            width={8}
            height={8}
            fillEnabled="true"
            fill="white"
            stroke="black"
            strokeWidth={1}
            key={index + 6000000}
            draggable
            onDragStart={(e) => onDragStart(e, 'rectangle')}
            onDragEnd={onDragEnd}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            id={index.toString() + '-x1-y2'} // tells the event which annotation, and which x and y to update
          />
          {/* Bottom Right Corner */}
          <Rect
            x={annotation.x2 * spectrogramWidthScale - 4}
            y={annotation.y2 + upper_tick_height - 4}
            width={8}
            height={8}
            fillEnabled="true"
            fill="white"
            stroke="black"
            strokeWidth={1}
            key={index + 7000000}
            draggable
            onDragStart={(e) => onDragStart(e, 'rectangle')}
            onDragEnd={onDragEnd}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            id={index.toString() + '-x2-y2'} // tells the event which annotation, and which x and y to update
          />
          {/* Description Label */}
          <Text
            text={annotation.description}
            fontFamily="serif"
            fontSize="24"
            x={annotation.x1 * spectrogramWidthScale}
            y={annotation.y1 + upper_tick_height - 23}
            fill="black"
            fontStyle="bold"
            key={index + 1000000}
          />
        </>
      ))}
      {ticks.map((tick, index) => (
        // couldnt get Line to work, kept getting NaN errors, so just using Rect instead
        <Rect
          x={tick.x}
          y={tick.y}
          width={tick.width}
          height={tick.height}
          fillEnabled="false"
          stroke="white"
          strokeWidth={1}
          key={index + 2000000}
        />
      ))}
      {labels.map((label, index) => (
        // for Text params see https://konvajs.org/api/Konva.Text.html
        <Text text={label.text} fontFamily="serif" fontSize="16" x={label.x} y={label.y} fill="white" key={index + 3000000} align="center" />
      ))}
    </Layer>
  );
};

export { AnnotationViewer };
