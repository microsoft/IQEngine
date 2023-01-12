import { Spectrogram } from './Spectrogram';
import { SpectrogramPanel } from './SpectrogramPanel';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { clear_fft_data } from '../../Utils/selector';
import { Component } from 'react';
import ScrollBar from './ScrollBar';

class SpectrogramPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connection: props.connection,
      blob: props.blob,
      meta: props.meta,
      fftSize: 1024,
      magnitudeMax: 255,
      magnitudeMin: 30,
      window: 'hamming',
      autoscale: false,
      tileNumber: 0,
    };
  }

  async getProperties(blobClient) {
    const properties = await blobClient.getProperties();
    const numBytes = properties.contentLength;
  }

  componentDidMount() {
    let { fetchMetaDataBlob, connection } = this.props;
    window.iq_data = [];
    clear_fft_data();
    fetchMetaDataBlob(connection); // fetch the metadata

    // Create BlobClient (connect to the data blob) if not local
    if (connection.datafilehandle === undefined) {
      let { accountName, containerName, sasToken, recording, blobClient } = connection;
      while (recording === '') {
        console.log('waiting'); // hopefully this doesn't happen, and if it does it should be pretty quick because its the time it takes for the state to set
      }
      let blobName = recording + '.sigmf-data';
      const { BlobServiceClient } = require('@azure/storage-blob');
      const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const tempBlobClient = containerClient.getBlobClient(blobName);
      this.props.updateConnectionBlobClient(tempBlobClient);
      this.getProperties(tempBlobClient);
    }
  }

  componentWillUnmount() {
    // make sure not to resetConnection() here or else it screws up ability to switch between recordings without clicking the browse button again
    this.props.resetMeta();
    window.iq_data = [];
    this.props.resetBlob();
  }

  // Not sure why we can do fft but not blob (we have to do blob.size)?
  static getDerivedStateFromProps(props, state) {
    let newState = state;
    if (JSON.stringify(props.meta) !== JSON.stringify(state.meta)) {
      newState.meta = props.meta;
      props.blob.status !== 'loading' && props.fetchMoreData({ blob: props.blob, meta: props.meta, connection: props.connection });
    }
    if (props.blob.size !== state.blob.size) {
      newState.blob.size = props.blob.size;
    }
    if (props.blob.status !== state.blob.status) {
      newState.blob.status = props.blob.status;
    }
    return { ...newState };
  }

  handleFftSize = (size) => {
    this.setState({
      fftSize: size,
    });
  };

  handleMagnitudeMin = (min) => {
    this.setState({
      magnitudeMin: min,
    });
  };

  handleWindowChange = (x) => {
    this.setState({
      window: x,
    });
  };

  handleMagnitudeMax = (max) => {
    this.setState({
      magnitudeMax: max,
    });
  };

  handleAutoScale = () => {
    const { autoscale } = this.state;
    this.setState({
      autoscale: !autoscale,
    });
  };

  handleTileNumber = (num) => {
    this.setState({
      tileNumber: num,
    });
  };

  render() {
    const { blob, meta, fftSize, magnitudeMax, magnitudeMin, autoscale } = this.state;
    const fft = {
      size: fftSize,
      magnitudeMax: magnitudeMax,
      magnitudeMin: magnitudeMin,
    };
    return (
      <div>
        <Container fluid>
          <Row className="flex-nowrap">
            <Col className="col-3">
              <Sidebar
                updateBlobTaps={this.props.updateBlobTaps}
                updateMagnitudeMax={this.handleMagnitudeMax}
                updateMagnitudeMin={this.handleMagnitudeMin}
                updateFftsize={this.handleFftSize}
                updateWindowChange={this.handleWindowChange}
                fft={fft}
                blob={blob}
                meta={meta}
                updateAutoScale={this.handleAutoScale}
              />
            </Col>
            <Col>
              <Spectrogram fft={fft} blob={blob} meta={meta} />
            </Col>
            <Col className="col-1">
              <ScrollBar handleTileNumber={this.handleTileNumber} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default SpectrogramPage;
