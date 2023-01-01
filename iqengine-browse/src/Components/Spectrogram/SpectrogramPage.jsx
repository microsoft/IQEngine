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
      fftSize: 1024,
      magnitudeMax: 255,
      magnitudeMin: 30,
      meta: props.meta,
    };
  }

  componentDidMount() {
    let { initFetchMoreBlob, fetchMetaDataBlob, connection, blob, meta } = this.props;
    // the route is /spectrogram/:recording.  we had to use a hack to allow for slashes in the name
    window.iq_data = [];
    clear_fft_data();

    fetchMetaDataBlob(connection); // fetch the metadata
    //initFetchMoreBlob({ connection: connection, blob: blob, meta: meta }); // fetch IQ for the first time
  }

  componentWillUnmount() {
    this.props.resetConnection();
    this.props.resetMeta();
    window.iq_data = [];
    this.props.resetBlob();
  }

  static getDerivedStateFromProps(props, state) {
    let newState = state;
    if (JSON.stringify(props.meta) !== JSON.stringify(state.meta)) {
      newState.meta = props.meta;
    }
    if (props.blob.size !== state.blob.size) {
      newState.blob.size = props.blob.size;
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
    const { magnitudeMax, magnitudeMin, fftSize, blob, meta } = this.state;
    const fftState = {
      magnitudeMax: magnitudeMax,
      magnitudeMin: magnitudeMin,
      size: fftSize,
    };
    return (
      <div>
        <Container fluid>
          <Row className="flex-nowrap">
            <Col className="col-3">
              <Sidebar
                handleFftSize={this.handleFftSize}
                handleMagnitudeMax={this.handleMagnitudeMax}
                handleMagnitudeMin={this.handleMagnitudeMin}
                updateBlobTaps={this.props.updateBlobTaps}
                meta={meta}
              />
            </Col>
            <Col>
              <SpectrogramPanel
                initFetchMoreBlob={this.props.initFetchMoreBlob}
                connection={this.state.connection}
                fft={fftState}
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
