import React, { useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';

const ScrollBar = () => {
  let stageWidth = 25;
  let stageHeight = 600;
  let handlerHeight = 50;

  const [Y, setY] = useState(0);

  const handleClick = (e) => {
    let currentY = e.evt.offsetY;
    setY(currentY - handlerHeight / 2);
  };

  const handleDragMove = (e) => {
    let y = e.target.y();
    if (y <= 0) {
      e.target.y(0);
    }
    if (y > stageHeight - handlerHeight) {
      e.target.y(stageHeight - handlerHeight);
    }
    e.target.x(0);
  };

  return (
    <Stage width={stageWidth} height={stageHeight}>
      <Layer>
        <Rect x={0} y={0} fill="grey" width={stageWidth} height={stageHeight} strokeWidth={4} onClick={handleClick}></Rect>
        <Rect x={0} y={Y} fill="black" width={stageWidth} height={handlerHeight} draggable={true} onDragMove={handleDragMove}></Rect>
      </Layer>
    </Stage>
  );
};

export default ScrollBar;
