// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

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

  return (
    <tr>
      <td>
        <div className="zoom">
          <img src={info.thumbnailUrl} alt="Spectrogram Thumbnail" style={{ width: '200px', height: '100px' }} />
        </div>
      </td>
      <td className="align-middle">
        <Link
          to={'/spectrogram/' + info.name.replace('.sigmf-meta', '')}
          onClick={() => updateConnection(info.metaFileHandle, info.dataFileHandle, info.name.replace('.sigmf-meta', ''))}
        >
          {info.name.replaceAll('(slash)', '/').replace('.sigmf-meta', '')}
        </Link>
      </td>
      <td className="align-middle">{info.dataType}</td>
      <td className="align-middle">{info.frequency}</td>
      <td className="align-middle">{info.sampleRate}</td>
      <td className="align-middle">
        <div>
          <Button type="button" onClick={toggle}>
            {info.numberOfAnnotation}
          </Button>

          <Modal isOpen={modal} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>{info.name}</ModalHeader>
            <ModalBody>
              {info.annotations.map((item, index) => {
                return (
                  <div key={index}>
                    <pre>{JSON.stringify(item, undefined, 4)}</pre>
                  </div>
                );
              })}
            </ModalBody>
          </Modal>
        </div>
      </td>
      <td className="align-middle">{info.author}</td>
    </tr>
  );
}
