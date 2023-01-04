import { SpectrogramPanel } from './SpectrogramPanel';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { clear_fft_data } from '../../Utils/selector';
import { Component } from 'react';

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
    };
  }

  componentDidMount() {
    let { fetchMetaDataBlob, connection } = this.props;
    window.iq_data = [];
    clear_fft_data();
    fetchMetaDataBlob(connection); // fetch the metadata
  }

  componentWillUnmount() {
    this.props.resetConnection();
    this.props.resetMeta();
    window.iq_data = [];
    this.props.resetBlob();
  }

  // Not sure why we can do fft but not blob (we have to do blob.size)?
  static getDerivedStateFromProps(props, state) {
    let newState = state;
    if (JSON.stringify(props.meta) !== JSON.stringify(state.meta)) {
      newState.meta = props.meta;
      props.blob.status !== "loading" && props.fetchMoreData({ blob: props.blob, meta: props.meta, connection: props.connection });
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

  handleMagnitudeMax = (max) => {
    this.setState({
      magnitudeMax: max,
    });
  };

  render() {
    const { blob, meta, fftSize, magnitudeMax, magnitudeMin } = this.state;
    const fft = {
      size: fftSize,
      magnitudeMax: magnitudeMax,
      magnitudeMin: magnitudeMin
    }
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
                fft={fft}
                blob={blob}
                meta={meta}
              />
            </Col>
            <Col>
              <SpectrogramPanel
                fetchMoreData={this.props.fetchMoreData}
                connection={this.state.connection}
                fft={fft}
                blob={blob}
                meta={meta}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default SpectrogramPage;
