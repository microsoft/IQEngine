import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { Component } from 'react';
import ScrollBar from './ScrollBar';
import { Layer, Image, Stage } from 'react-konva';
import { select_fft, clear_fft_data, calculateTileNumbers, range } from '../../Utils/selector';
import { AnnotationViewer } from './AnnotationViewer';
import { RulerTop } from './RulerTop';

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
      image: null,
      annotations: [],
      sampleRate: 1,
      handleHeightPixels: 50,
      stageRef: null,
      bytesPerSample: 2,
      data_type: '',
      upperTile: -1,
      lowerTile: -1,
    };
  }

  componentDidMount() {
    let { fetchMetaDataBlob, connection } = this.props;
    window.iq_data = {};
    clear_fft_data();
    fetchMetaDataBlob(connection); // fetch the metadata
  }

  componentWillUnmount() {
    // make sure not to resetConnection() here or else it screws up ability to switch between recordings without clicking the browse button again
    this.props.resetMeta();
    window.iq_data = {};
    this.props.resetBlob();
  }

  componentDidUpdate(prevProps, prevState) {
    let newState = prevState;
    let update = false;
    const props = this.props;
    if (JSON.stringify(this.props.meta) !== JSON.stringify(prevProps.meta)) {
      newState.meta = props.meta;
      const data_type = newState.meta.global['core:datatype'];
      if (!data_type) {
        console.log('WARNING: Incorrect data type');
      }
      newState.data_type = data_type;
      if (data_type === 'ci16_le') {
        newState.bytesPerSample = 2;
      } else if (data_type === 'cf32_le') {
        newState.bytesPerSample = 4;
      }
      update = true;
    }
    if (JSON.stringify(props.connection) !== JSON.stringify(prevProps.connection)) {
      newState.connection = props.connection;
    }
    if (props.blob.size !== prevProps.blob.size) {
      newState.blob.size = props.blob.size;
      const { blob, bytesPerSample, fftSize, tileNumber } = newState;
      let { lowerTile, upperTile } = newState;
      // check whether we have fetched all the data so we can update the spectrogram
      if (upperTile === -1 || lowerTile === -1) {
        let vals = calculateTileNumbers(tileNumber, bytesPerSample, blob, fftSize);
        lowerTile = vals.lowerTile;
        upperTile = vals.upperTile;
      }
      const tiles = range(Math.floor(lowerTile), Math.ceil(upperTile));
      let shouldRender = true;
      for (let tile in tiles) {
        if (!window.iq_data.hasOwnProperty(tile.toString())) {
          shouldRender = false;
          break;
        }
      }
      if (shouldRender) {
        this.renderImage(lowerTile, upperTile);
      }
    }
    if (props.blob.totalBytes !== prevProps.blob.totalBytes) {
      newState.blob.totalBytes = props.blob.totalBytes;
    }
    if (props.blob.status !== prevProps.blob.status) {
      newState.blob.status = props.blob.status;
    }
    if (update && newState.connection.blobClient != null) {
      newState.fetchSize = 5;
      for (let index = 0; index < 5; index++) {
        props.fetchMoreData({ blob: newState.blob, data_type: newState.data_type, connection: newState.connection, tile: index });
      }
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

  renderImage = (lowerTile, upperTile) => {
    const { bytesPerSample, fftSize, magnitudeMax, magnitudeMin, meta, window, autoscale } = this.state;
    // Update the image (eventually this should get moved somewhere else)
    let ret = select_fft(lowerTile, upperTile, bytesPerSample, fftSize, magnitudeMax, magnitudeMin, meta, window, autoscale);
    if (ret) {
      // Draw the spectrogram
      createImageBitmap(ret.image_data).then((ret) => {
        this.setState({ image: ret });
        console.log('Image Updated');
      });
      if (autoscale && ret.autoMax) {
        this.updateAutoScale(); // toggles it off so this only will happen once
        this.updateMagnitudeMax(ret.autoMax);
        this.updateMagnitudeMin(ret.autoMin);
      }

      this.setState({ annotations: ret.annotations });
      this.setState({ sampleRate: ret.sample_rate });
    }
  };

  // num is the y pixel coords of the top of the scrollbar handle, so range of 0 to the height of the scrollbar minus height of handle
  setTileNumbers = (handleTop) => {
    const { blob, connection, data_type, bytesPerSample, fftSize } = this.state;
    const { upperTile, lowerTile } = calculateTileNumbers(handleTop, bytesPerSample, blob, fftSize);
    this.setState({ lowerTile: lowerTile, upperTile: upperTile });

    const tiles = range(Math.floor(lowerTile), Math.ceil(upperTile));
    this.setState({
      tileNumber: tiles[0],
    });

    var allFetched = true;
    // Fetch the tiles
    if (blob.status !== 'loading') {
      for (let tile of tiles) {
        if (!(tile.toString() in window.iq_data)) {
          console.log('fetchMoreData with tile', tile);
          allFetched = false;
          this.props.fetchMoreData({ tile: tile, connection: connection, blob: blob, data_type: data_type });
        }
      }
    } else {
      console.log('BLOB STATUS IS LOADING');
    }
    if (allFetched) {
      this.renderImage(lowerTile, upperTile);
    }
  };

  render() {
    const { blob, meta, fftSize, magnitudeMax, magnitudeMin, image, annotations, sampleRate, stageRef } = this.state;
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
              <Stage width={600} height={20}>
                <RulerTop
                  fftSize={fftSize}
                  sampleRate={sampleRate}
                  timescale_width={20}
                  text_width={10}
                  upper_tick_height={0}
                  spectrogram_width={600}
                  fft={fft}
                  meta={meta}
                  blob={blob}
                  spectrogramWidthScale={600 / fftSize}
                />
              </Stage>
              <Stage width={600} height={600} stageRef={stageRef}>
                <Layer>
                  <Image image={image} x={0} y={0} width={600} height={600} />
                </Layer>
                <AnnotationViewer
                  timescale_width={20}
                  text_width={10}
                  upper_tick_height={0}
                  spectrogram_width={600}
                  fft={fft}
                  meta={meta}
                  blob={blob}
                  stageRef={stageRef}
                  annotations={annotations}
                  spectrogramWidthScale={600 / fftSize}
                  spectrogramHeightScale={1}
                  fftSize={fftSize}
                  sampleRate={sampleRate}
                />
              </Stage>
            </Col>
            <Col style={{ justifyContent: 'left' }}>
              <ScrollBar setTileNumbers={this.setTileNumbers} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default SpectrogramPage;
