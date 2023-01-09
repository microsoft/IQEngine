// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { formControlClasses } from '@mui/material';

export default function FileRow({ info, updateConnectionMetaFileHandle, updateConnectionDataFileHandle, updateConnectionRecording }) {
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };

  const updateConnection = (metaFileHandle, dataFileHandle, name) => {
    updateConnectionMetaFileHandle(metaFileHandle);
    updateConnectionDataFileHandle(dataFileHandle);
    updateConnectionRecording(name);
  };

  const annotationsData = info.annotations.map((item, index) => {
    const deepItemCopy = JSON.parse(JSON.stringify(item));
    delete deepItemCopy['core:sample_start'];
    delete deepItemCopy['core:sample_count'];
    delete deepItemCopy['core:freq_lower_edge'];
    delete deepItemCopy['core:freq_upper_edge'];
    delete deepItemCopy['core:description'];

    return (
      <tr key={index}>
        <td>{item['core:sample_start']}</td>
        <td>{item['core:sample_count']}</td>
        <td>{item['core:freq_lower_edge'] / 1e6}</td>
        <td>{item['core:freq_upper_edge'] / 1e6}</td>
        <td>{item['core:description']}</td>
        <td>{JSON.stringify(deepItemCopy, null, 4).replaceAll('{', '').replaceAll('}', '').replaceAll('"', '')}</td>
      </tr>
    );
  });

  function NewlineText(props) {
    const text = props.text;
    return <div className="datatypetext">{text}</div>;
  }

  return (
    <tr>
      <td>
        <div className="zoom">
          <img src={info.thumbnailUrl} alt="Spectrogram Thumbnail" style={{ width: '200px', height: '100px' }} />
        </div>
      </td>
      <td className="align-middle">
        <Link
          to={'spectrogram/' + info.name.replace('.sigmf-meta', '')}
          onClick={() => updateConnection(info.metaFileHandle, info.dataFileHandle, info.name.replace('.sigmf-meta', ''))}
        >
          {info.name.replaceAll('(slash)', '/').replace('.sigmf-meta', '')}
        </Link>
      </td>
      <td className="align-middle" style={{ textAlign: 'center' }}>
        <NewlineText text={info.dataType} />
      </td>
      <td className="align-middle" style={{ textAlign: 'center' }}>
        {info.frequency}
      </td>
      <td className="align-middle" style={{ textAlign: 'center' }}>
        {info.sampleRate}
      </td>
      <td className="align-middle" style={{ textAlign: 'center' }}>
        <div>
          <Button type="button" variant="secondary" onClick={toggle}>
            {info.numberOfAnnotation}
          </Button>

          <Modal isOpen={modal} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>{info.name}</ModalHeader>
            <ModalBody>
              <table className="table">
                <thead>
                  <tr>
                    <th>Sample Start</th>
                    <th>Sample Count</th>
                    <th>Frequency Min [MHz]</th>
                    <th>Frequency Max [MHz]</th>
                    <th>Description</th>
                    <th>Other</th>
                  </tr>
                </thead>
                <tbody>{annotationsData}</tbody>
              </table>
            </ModalBody>
          </Modal>
        </div>
      </td>
      <td className="align-middle">{info.author}</td>
    </tr>
  );
}
