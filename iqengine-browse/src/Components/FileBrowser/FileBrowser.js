// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LocalFileBrowser from './LocalFileBrowser';
import RecordingsBrowser from './RecordingsBrowser';
import AzureBlobBrowser from './AzureBlobBrowser';

class FileBrowser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: props.recording, // look at the end of DataFetcher to see how this data structure works
      accountName: props.connection.accountName,
      containerName: props.connection.containerName,
      sasToken: props.connection.sasToken,
      metafilehandle: props.connection.metafilehandle,
      datafilehandle: props.connection.datafilehandle,
    };
  }

  componentDidMount() {
    this.props.updateConnectionMetaFileHandle('');
    this.props.updateConnectionDataFileHandle('');
  }

  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(props) !== JSON.stringify(state)) {
      return {
        ...props,
      };
    }
  }

  render() {
    const { accountName, containerName, sasToken, metafilehandle, datafilehandle, recording } = this.state;
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <LocalFileBrowser
                setRecordingList={this.props.fetchRecordingsList}
                updateConnectionMetaFileHandle={this.props.updateConnectionMetaFileHandle}
                updateConnectionDataFileHandle={this.props.updateConnectionDataFileHandle}
                metafilehandle={metafilehandle}
                datafilehandle={datafilehandle}
              />
            </Col>
            <Col md="auto">
              <br />
              <div className="vr" style={{ opacity: 0.6, minHeight: 250 }}></div>
            </Col>
            <Col>
              <AzureBlobBrowser
                setRecordingList={this.props.fetchRecordingsList}
                updateConnectionAccountName={this.props.updateConnectionAccountName}
                updateConnectionContainerName={this.props.updateConnectionContainerName}
                updateConnectionSasToken={this.props.updateConnectionSasToken}
                accountName={accountName}
                containerName={containerName}
                sasToken={sasToken}
              />
            </Col>
          </Row>
        </Container>

        <RecordingsBrowser
          updateConnectionRecording={this.props.updateConnectionRecording}
          updateConnectionMetaFileHandle={this.props.updateConnectionMetaFileHandle}
          updateConnectionDataFileHandle={this.props.updateConnectionDataFileHandle}
          data={recording.recordingsList}
        />
      </div>
    );
  }
}

export default FileBrowser;
