import { SpectrogramPanel } from './SpectrogramPanel';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { clear_fft_data } from '../../Utils/selector';
import { Component, useEffect, useState } from 'react';
import './Spectrogram.css';
import InfoPane from './InfoPane';
import SettingsPane from './SettingsPane';
import AnnotationsPane from './AnnotationsPane';

class Spectrogram extends Component {
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

  render() {
    const { blob, meta, fftSize, magnitudeMax, magnitudeMin } = this.state;
    const fft = {
      size: fftSize,
      magnitudeMax: magnitudeMax,
      magnitudeMin: magnitudeMin,
    };
    return (
      <div className="spectrogram">
        <div className="spectrogram-info">
          <InfoPane meta={meta} />
        </div>
        <div className="spectrogram-container">
          <div className="spectrogram-settings">
            <SettingsPane
              updateBlobTaps={this.props.updateBlobTaps}
              updateMagnitudeMax={this.props.updateMagnitudeMax}
              updateMagnitudeMin={this.props.updateMagnitudeMin}
              updateFftsize={this.props.updateFftsize}
              updateWindowChange={this.props.updateWindowChange}
              meta={this.props.meta}
            />
          </div>
          <div className="spectrogram-pic">
            <SpectrogramPanel
              fetchMoreData={this.props.fetchMoreData}
              connection={this.state.connection}
              fft={fft}
              blob={blob}
              meta={meta}
              window={this.state.window}
            />
          </div>
          <div className="spectrogram-annotations">
            <AnnotationsPane />
          </div>
        </div>
      </div>
    );
  }
}

export default Spectrogram;

// const Spectrogram = (props) => {
//   const [state, setState] = useState({
//     connection: props.connection,
//     blob: props.blob,
//     meta: props.meta,
//     fftSize: 1024,
//     magnitudeMax: 255,
//     magnitudeMin: 30,
//     window: 'hamming',
//   });

//   useEffect(() => {
//     window.iq_data = [];
//     clear_fft_data();
//     props.fetchMetaDataBlob(props.connection); // fetch the metadata

//     return () => {
//       props.resetConnection();
//       props.resetMeta();
//       window.iq_data = [];
//       props.resetBlob();
//     };
//   }, []);

// useEffect(() => {
//   let newState = { ...state };
//   if (JSON.stringify(props.meta) !== JSON.stringify(state.meta)) {
//     newState.meta = props.meta;
//     props.blob.status !== 'loading' && props.fetchMoreData({ blob: props.blob, meta: props.meta, connection: props.connection });
//   }
//   if (props.blob.size !== state.blob.size) {
//     newState.blob.size = props.blob.size;
//   }
//   if (props.blob.status !== state.blob.status) {
//     newState.blob.status = props.blob.status;
//   }
//   // setState({ newState });
// }, []);

//   const handleFftSize = (size) => {
//     setState(...state, { fftSize: size });
//   };

//   const handleMagnitudeMax = (max) => {
//     setState(...state, { magnitudeMax: max });
//   };

//   const handleMagnitudeMin = (min) => {
//     setState(...state, { magnitudeMin: min });
//   };

//   const handleWindowChange = (x) => {
//     setState(...state, { window: x });
//   };

//   const fft = {
//     size: state.fftSize,
//     magnitudeMax: state.magnitudeMax,
//     magnitudeMin: state.magnitudeMin,
//   };

//   return (
//     <div>
//       <Container fluid>
//         <Row className="flex-nowrap">
//           <Col className="col-3">
//             <Sidebar
//               updateBlobTaps={props.updateBlobTaps}
//               updateMagnitudeMax={handleMagnitudeMax}
//               updateMagnitudeMin={handleMagnitudeMin}
//               updateFftsize={handleFftSize}
//               updateWindowChange={handleWindowChange}
//               fft={fft}
//               blob={state.blob}
//               meta={state.meta}
//             />
//           </Col>
//           <Col>
//             <SpectrogramPanel
//               fetchMoreData={props.fetchMoreData}
//               connection={state.connection}
//               fft={fft}
//               blob={state.blob}
//               meta={state.meta}
//               window={state.window}
//             />
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Spectrogram;
