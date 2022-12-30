// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { Component } from 'react';
// import ConnectionStringInput from './Components/FileBrowser/ConnectionString';
// import RecordingsBrowser from './Components/FileBrowser/RecordingsBrowser';
// import LocalFileChooser from './Components/FileBrowser/LocalFileChooser';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LocalFileChooser from './LocalFileChooser';
import ConnectionStringInput from './ConnectionString';
import RecordingsBrowser from './RecordingsBrowser';

class FileBrowser extends Component {
  constructor(props) {
    super(props);
    this.setRecordingList.bind(this);
    this.state = {
      recordingList: [], // look at the end of DataFetcher to see how this data structure works
      accountName: props.accountName,
      containerName: props.containerName,
      sasToken: props.sasToken,
      metafilehandle: props.metafilehandle,
      datafilehandle: props.datafilehandle,
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

  // Allows child to set state in parent component (this component)
  setRecordingList = (x) => {
    this.setState({ recordingList: x });
  };

  render() {
    const { accountName, containerName, sasToken, metafilehandle, datafilehandle } = this.state;
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <LocalFileChooser
                setRecordingList={this.setRecordingList}
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
              <ConnectionStringInput
                setRecordingList={this.setRecordingList}
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
          data={this.state.recordingList}
        />
      </div>
    );
  }
}

export default FileBrowser;
