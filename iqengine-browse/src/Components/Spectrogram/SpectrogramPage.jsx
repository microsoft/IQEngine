import { SpectrogramPanel } from './spectrogram-panel';
import { Container, Row, Col } from 'react-bootstrap';
import FetchMoreData from '../../reducers/fetchMoreData';
import { FetchMeta } from '../../reducers/metaSlice';
import { useDispatch } from 'react-redux';
import Sidebar from './sidebar';
import { updateRecording } from '../../reducers/connectionSlice';
import { useParams } from 'react-router-dom';
import { updateSize } from '../../reducers/blobSlice';
import { clear_fft_data } from '../../selector';

function SpectrogramPage() {
  const dispatch = useDispatch();

  dispatch(updateRecording(useParams().recording.replaceAll('(slash)', '/'))); // the route is /spectrogram/:recording.  we had to use a hack to allow for slashes in the name

  dispatch(updateSize(0)); // reset the number of samples downloaded when this page loads
  clear_fft_data();

  dispatch(FetchMoreData()); // fetch IQ for the first time
  dispatch(FetchMeta); // fetch the metadata

  return (
    <div>
      <Container fluid>
        <Row className="flex-nowrap">
          <Col className="col-3">
            <Sidebar />
          </Col>
          <Col>
            <SpectrogramPanel />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SpectrogramPage;
