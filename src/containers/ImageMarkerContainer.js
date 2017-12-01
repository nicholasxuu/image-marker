/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImageMarker from '../components/main/ImageMarker';
import { saveMarkedResult } from '../actions/Api';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    onSave: saveMarkedResult,
  }, dispatch),
});

const ImageMarkerContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImageMarker);

export default ImageMarkerContainer;
