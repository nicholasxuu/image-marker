/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImageMarker from '../components/main/ImageMarker';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
  }, dispatch),
});

const ImageMarkerContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImageMarker);

export default ImageMarkerContainer;
