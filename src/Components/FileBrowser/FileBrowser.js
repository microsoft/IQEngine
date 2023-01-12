// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LocalFileBrowser from './LocalFileBrowser';
import RecordingsBrowser from './RecordingsBrowser';
import AzureBlobBrowser from './AzureBlobBrowser';
import RepositoryTile from './RepositoryTile';

const FileBrowser = (props) => {
  const tileObj = JSON.parse(process.env.REACT_APP_CONNECTION_INFO);
  const tileObjInfo = tileObj.settings;

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
        <Row>
          {tileObjInfo.map((item, i) => (
            <Col>
              <RepositoryTile key={i} item={item}></RepositoryTile>
            </Col>
          ))}
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
