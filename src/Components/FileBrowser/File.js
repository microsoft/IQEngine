// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export default function FileRow({ item, updateConnectionMetaFileHandle, updateConnectionDataFileHandle, updateConnectionRecording }) {
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };

  const updateConnection = (metaFileHandle, dataFileHandle, name) => {
    updateConnectionMetaFileHandle(metaFileHandle);
    updateConnectionDataFileHandle(dataFileHandle);
    updateConnectionRecording(name);
  };

  const annotationsData = item.annotations.map((item, index) => {
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
          <img src={item.thumbnailUrl} alt="Spectrogram Thumbnail" style={{ width: '200px', height: '100px' }} />
        </div>
      </td>
      <td className="align-middle">
        <Link
          to={'spectrogram/' + item.name.replace('.sigmf-meta', '')}
          onClick={() => updateConnection(item.metaFileHandle, item.dataFileHandle, item.name.replace('.sigmf-meta', ''))}
        >
          {item.name.replaceAll('(slash)', '/').replace('.sigmf-meta', '')}
        </Link>
      </td>
      <td className="align-middle" style={{ textAlign: 'center' }}>
        <NewlineText text={item.dataType} />
      </td>
      <td className="align-middle" style={{ textAlign: 'center' }}>
        {item.frequency}
      </td>
      <td className="align-middle" style={{ textAlign: 'center' }}>
        {item.sampleRate}
      </td>
      <td className="align-middle" style={{ textAlign: 'center' }}>
        <div>
          <Button type="button" variant="secondary" onClick={toggle}>
            {item.numberOfAnnotation}
          </Button>

          <Modal isOpen={modal} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>{item.name}</ModalHeader>
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
      <td className="align-middle">{item.author}</td>
      <td className="align-middle">{item.email}</td>
    </tr>
  );
}
