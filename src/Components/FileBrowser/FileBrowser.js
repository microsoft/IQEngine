// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LocalFileBrowser from './LocalFileBrowser';
import RecordingsBrowser from './RecordingsBrowser';
import AzureBlobBrowser from './AzureBlobBrowser';

const FileBrowser = (props) => {
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <LocalFileBrowser
              setRecordingList={props.fetchRecordingsList}
              updateConnectionMetaFileHandle={props.updateConnectionMetaFileHandle}
              updateConnectionDataFileHandle={props.updateConnectionDataFileHandle}
              metafilehandle={props.metafilehandle}
              datafilehandle={props.datafilehandle}
            />
          </Col>
          <Col md="auto">
            <br />
            <div className="vr" style={{ opacity: 0.6, minHeight: 250 }}></div>
          </Col>
          <Col>
            <AzureBlobBrowser
              setRecordingList={props.fetchRecordingsList}
              updateConnectionAccountName={props.updateConnectionAccountName}
              updateConnectionContainerName={props.updateConnectionContainerName}
              updateConnectionSasToken={props.updateConnectionSasToken}
              accountName={props.accountName}
              containerName={props.containerName}
              sasToken={props.sasToken}
            />
          </Col>
        </Row>
      </Container>

      <RecordingsBrowser
        updateConnectionRecording={props.updateConnectionRecording}
        updateConnectionMetaFileHandle={props.updateConnectionMetaFileHandle}
        updateConnectionDataFileHandle={props.updateConnectionDataFileHandle}
        data={props.recording.recordingsList}
      />
    </div>
  );
};

export default FileBrowser;
