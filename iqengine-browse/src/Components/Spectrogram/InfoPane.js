// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import './InfoPane.css';

// LOOK AT THIS PLS
const InfoPane = (props) => {
  const metaGlobal = props.meta.global;
  return (
    <div className="info-pane">
      {metaGlobal['core:description'] && (
        <div className="info-pane-item">
          <div className="info-pane-item-title">Desc</div>
          <div className="info-pane-item-value">{metaGlobal['core:description']}</div>
        </div>
      )}
      {metaGlobal['core:author'] && (
        <div className="info-pane-item">
          <div className="info-pane-item-title">Author</div>
          <div className="info-pane-item-value">{metaGlobal['core:author']}</div>
        </div>
      )}
      {metaGlobal['core:version'] && (
        <div className="info-pane-item">
          <div className="info-pane-item-title">Version</div>
          <div className="info-pane-item-value">{metaGlobal['core:version']}</div>
        </div>
      )}
      {metaGlobal['core:sample_rate'] && (
        <div className="info-pane-item">
          <div className="info-pane-item-title">Sample Rate</div>
          <div className="info-pane-item-value">{metaGlobal['core:sample_rate']} Hz</div>
        </div>
      )}
      {metaGlobal['core:recorder'] && (
        <div className="info-pane-item">
          <div className="info-pane-item-title">Recorder</div>
          <div className="info-pane-item-value">{metaGlobal['core:recorder']}</div>
        </div>
      )}
      {metaGlobal['core:hw'] && (
        <div className="info-pane-item">
          <div className="info-pane-item-title">HW</div>
          <div className="info-pane-item-value">{metaGlobal['core:hw']}</div>
        </div>
      )}
      {metaGlobal['antenna:gain'] && (
        <div className="info-pane-item">
          <div className="info-pane-item-title">Gain</div>
          <div className="info-pane-item-value">{metaGlobal['antenna:gain']}db Ant. Gain</div>
        </div>
      )}
      {metaGlobal['antenna:type'] && (
        <div className="info-pane-item">
          <div className="info-pane-item-title">Type</div>
          <div className="info-pane-item-value">{metaGlobal['antenna:type']}</div>
        </div>
      )}
    </div>
  );
};

export default InfoPane;
