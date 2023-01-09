import React, { useState } from 'react';
import './AnnotationsPane.css';

const AnnotationsPane = () => {
    const [open, setOpen] = useState(true);

  const togglePanel = () => {
    setOpen(!open);
  };

  return (
    <div className={"annotations-pane " + open}>
      <div className="annotations-pane-title bg6">
        <div className="annotations-pane-text">Annotations</div>
        <button className="annotations-pane-close" onClick={togglePanel}></button>
      </div>
      <div className="annotations-pane-list">
        <div className="annotations-pane-item">Annotation 1</div>
        <div className="annotations-pane-item">Annotation 2</div>
        <div className="annotations-pane-item">Annotation 3</div>
      </div>
    </div>
  );
};

export default AnnotationsPane;
