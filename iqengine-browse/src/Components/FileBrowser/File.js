// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const File = (props) => {
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };

  const updateConnection = (metaFileHandle, dataFileHandle, name) => {
    props.updateConnectionMetaFileHandle(metaFileHandle);
    props.updateConnectionDataFileHandle(dataFileHandle);
    props.updateConnectionRecording(name);
  };
  return (
    <tr>
      <td>
        <div className="zoom">
          <img src={props.info.thumbnailUrl} alt="Spectrogram Thumbnail" style={{ width: '200px', height: '100px' }} />
        </div>
      </td>
      <td className="align-middle">
        <Link
          to={'/spectrogram/' + props.info.name.replace('.sigmf-meta', '')}
          onClick={() => updateConnection(props.info.metaFileHandle, props.info.dataFileHandle, props.info.name.replace('.sigmf-meta', ''))}
        >
          {props.info.name.replaceAll('(slash)', '/').replace('.sigmf-meta', '')}
        </Link>
      </td>
      <td className="align-middle">{props.info.dataType}</td>
      <td className="align-middle">{props.info.frequency}</td>
      <td className="align-middle">{props.info.sampleRate}</td>
      <td className="align-middle">
        <div>
          <Button type="button" onClick={toggle}>
            {props.info.numberOfAnnotation}
          </Button>

          <Modal isOpen={modal} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>{props.info.name}</ModalHeader>
            <ModalBody>
              {props.info.annotations.map((item, index) => {
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
      <td className="align-middle">{props.info.author}</td>
    </tr>
  );
};

export default File;
