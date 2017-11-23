/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImageMarker from '../components/main/ImageMarker';
import { saveMarkedResult } from '../actions/SampleApiActions';

const mapStateToProps = state => ({
  imageUrl: '/sample/test.jpg',
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    saveMarkedResult,
  }, dispatch),
});

const ImageMarkerContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImageMarker);

export default ImageMarkerContainer;