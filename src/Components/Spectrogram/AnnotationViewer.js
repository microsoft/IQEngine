// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { select_fft } from '../../Utils/selector';
import React, { useState, useEffect } from 'react';
import { Layer, Rect, Text, Circle } from 'react-konva';
import { ConstructionOutlined } from '@mui/icons-material';

function getItem(item) {
  if (item.type === 'circle') {
    return <Circle x={item.x} y={item.y} fill="red" radius={20} />;
  }
  return <Rect x={item.x} y={item.y} fill="green" width={20} height={20} />;
}

function getPreview(data) {
  if (data === null) {
    return null;
  }
  return getItem(data);
}

const AnnotationViewer = (props) => {
  let { blob, fft, meta, windowFunction, spectrogram_width, upper_tick_height, stageRef } = props;

  const [fftSize, setFftSize] = useState();
  const [spectrogramWidthScale, setSpectrogramWidthScale] = useState();
  const [annotations, setAnnotations] = useState([]);
  const [ticks, setTicks] = useState([]);
  const [labels, setLabels] = useState([]);
  const [dragDropData, setDragDropData] = useState(null);

  // These two lines are a hack used to force a re-render when an annotation is updated, which for some reason wasnt updating
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const previewItem = getPreview(dragDropData);

  useEffect(() => {
    let ret = select_fft(blob, fft, meta);
    if (!ret) {
      return;
    }
    setAnnotations(ret.annotations);
    setFftSize(ret.fft_size);
    setSpectrogramWidthScale(ret.image_data ? spectrogram_width / ret.image_data.width : 1);

    // Draw the vertical scales
    let num_ticks = ret.image_data.height / 10;
    const timescale_width = 5;
    let time_per_row = ret.fft_size / ret.sample_rate;
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
  }, [blob, fft, meta, spectrogram_width, windowFunction, upper_tick_height]);

  if (annotations.length <= 1) {
    return <></>;
  }

  function onDragStart(e, type) {
    console.log('drag start');
    //setDragDropData({ x: 0, y: 0, type });
    //e.target.classList.add('hide');
  }

  function onDragEnd(e) {
    const stage = stageRef.current;
    stage.setPointersPositions(e);
    const scale = stage.scaleX();
    //const position = stage.getPointerPosition(); // this was returning NaNs but the example code had it working
    //let x = (position.x - stage.x()) / scale;
    //let y = (position.y - stage.y()) / scale;
    const x = e.target.x(); // look at box coords instead of cursor coords because above code didnt work
    const y = e.target.y();
    const annot_indx = e.target.id().split('-')[0];
    const annot_pos_x = e.target.id().split('-')[1];
    const annot_pos_y = e.target.id().split('-')[2];
    annotations[annot_indx][annot_pos_x] = x / spectrogramWidthScale; // reverse the calcs done to generate the coords
    annotations[annot_indx][annot_pos_y] = y - upper_tick_height;
    /* setAnnotations({
      ...annotations, 
      annotations[annot_indx]: x / spectrogramWidthScale,
      }) */
    forceUpdate(); // TODO remove the forceupdate and do it the proper way (possibly using spread?)
    props.updateMeta(annotations);
    updateAnnotationFields(annot_indx);
  }

  function onDrop(e) {
    console.log('dropped');
    e.preventDefault();
    setDragDropData(null);
  }

  // function converting coordinates back into the annotations fields
  function updateAnnotationFields(f) {
    let updatedAnnotations = [...props.meta.annotations];
    updatedAnnotations[f]['core:sample_start'] = fftSize * f.y2 - updatedAnnotations[f]['core:sample_count'];
    updatedAnnotations[f]['core:sample_count'] = fftSize * f.y2 - updatedAnnotations[f]['core:sample_start'];
    updatedAnnotations[f]['core:freq_lower_edge'] =
      (meta.global['core:sample_rate'] * f.x1) / fftSize + meta.captures[0]['core:frequency'] / 2 - meta.global['core:sample_rate'] / 2;
    updatedAnnotations[f]['core:freq_upper_edge'] =
      (meta.global['core:sample_rate'] * f.x2) / fftSize + meta.captures[0]['core:frequency'] / 2 - meta.global['core:sample_rate'] / 2;
    props.updateMeta(updatedAnnotations);
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
            y={annotation.y1 + upper_tick_height}
            width={(annotation.x2 - annotation.x1) * spectrogramWidthScale}
            height={annotation.y2 - annotation.y1}
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
