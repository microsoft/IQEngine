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
      tileNumbers: [],
    };
  }

  async getProperties(blobClient) {
    const properties = await blobClient.getProperties();
    const numBytes = properties.contentLength;
    this.props.updateBlobTotalBytes(numBytes);
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
    if (props.blob.totalBytes !== state.blob.totalBytes) {
      newState.blob.totalBytes = props.blob.totalBytes;
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

  // num is the y pixel coords of the top of the scrollbar handle, so range of 0 to the height of the scrollbar minus height of handle
  setTileNumbers = (handleTop) => {
    const totalBytes = this.state.blob.totalBytes;
    const data_type = this.state.meta.global['core:datatype'];

    let bytes_per_sample = 2;
    if (data_type === 'ci16_le') {
      bytes_per_sample = 2;
    } else if (data_type === 'cf32_le') {
      bytes_per_sample = 4;
    } else {
      bytes_per_sample = 2;
    }

    const totalNumFFTs = totalBytes / bytes_per_sample / 2 / this.state.fftSize; // divide by 2 because IQ
    const scrollBarHeight = 600; // TODO REPLACE ME WITH ACTUAL WINDOW HEIGHT
    const handleFraction = scrollBarHeight / totalNumFFTs;
    console.log('handleFraction:', handleFraction);
    const handleHeightPixels = handleFraction * scrollBarHeight;

    // Find which tiles are within view
    const tileSizeInRows = 400; // ARBITRARY.  TODO: should probably store tile size in bytes in the constants file, then calc tileSizeInRows
    const numTilesInFile = Math.ceil(totalNumFFTs / tileSizeInRows);
    console.log('numTilesInFile:', numTilesInFile);
    const lowerTile = (totalNumFFTs / tileSizeInRows) * (handleTop / scrollBarHeight);
    const upperTile = (totalNumFFTs / tileSizeInRows) * ((handleTop + handleHeightPixels) / scrollBarHeight);
    console.log(lowerTile, upperTile); // its not going to go all the way to numTilesInFile because the handle isnt resizing itself yet

    // mimicing python's range() function which gives array of integers between two values non-inclusive of end
    function range(start, end) {
      return Array.apply(0, Array(end - start + 1)).map((element, index) => index + start);
    }

    const tiles = range(Math.floor(lowerTile), Math.ceil(upperTile));
    console.log(tiles);
    this.setState({
      tileNumbers: tiles,
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
              <ScrollBar setTileNumbers={this.setTileNumbers} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default SpectrogramPage;
