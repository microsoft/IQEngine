import React, { useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';

const ScrollBar = (props) => {
  let stageWidth = 25;
  let stageHeight = 600; // TODO REPLACE ME WITH ACTUAL WINDOW HEIGHT
  let handlerHeight = 50;

  const [y, setY] = useState(0);

  const handleClick = (e) => {
    let currentY = e.evt.offsetY;
    let newY = currentY - handlerHeight / 2;
    if (newY < 0) {
      newY = 0;
    }
    if (newY > stageHeight - handlerHeight) {
      newY = stageHeight - handlerHeight;
    }
    setY(newY);
    props.handleTileNumber(newY);
  };

  const handleDragMove = (e) => {
    let newY = e.target.y();
    if (newY <= 0) {
      e.target.y(0);
      newY = 0;
    }
    if (newY > stageHeight - handlerHeight) {
      e.target.y(stageHeight - handlerHeight);
      newY = stageHeight - handlerHeight;
    }
    e.target.x(0);
    setY(newY);
    props.handleTileNumber(newY);
  };

  return (
    <Stage width={stageWidth} height={stageHeight}>
      <Layer>
        <Rect x={0} y={0} fill="grey" width={stageWidth} height={stageHeight} strokeWidth={4} onClick={handleClick}></Rect>
        <Rect x={0} y={y} fill="black" width={stageWidth} height={handlerHeight} draggable={true} onDragMove={handleDragMove}></Rect>
      </Layer>
    </Stage>
  );
};

export default ScrollBar;
