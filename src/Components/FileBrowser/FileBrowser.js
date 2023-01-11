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
  const myobj = JSON.parse(process.env.REACT_APP_CONNECTION_INFO);

  const name1 = myobj.settings[0]['name'];
  const accountName1 = myobj.settings[0]['accountName'];
  const containerName1 = myobj.settings[0]['containerName'];
  const description1 = myobj.settings[0]['description'];
  const imgUrl1 = myobj.settings[0]['imageURL'];

  const name2 = myobj.settings[1]['name'];
  const accountName2 = myobj.settings[1]['accountName'];
  const containerName2 = myobj.settings[1]['containerName'];
  const description2 = myobj.settings[1]['description'];
  const imgUrl2 = myobj.settings[1]['imageURL'];

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
          <Col>
            <RepositoryTile
              name={name1}
              accountName={accountName1}
              containerName={containerName1}
              description={description1}
              imgUrl={imgUrl1}
            ></RepositoryTile>
          </Col>
          <Col>
            <RepositoryTile
              name={name2}
              accountName={accountName2}
              containerName={containerName2}
              description={description2}
              imgUrl={imgUrl2}
            ></RepositoryTile>
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
