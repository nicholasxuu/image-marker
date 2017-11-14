/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import App from '../components/main/App';
import { getSampleParam } from '../selectors/SampleSelector';

const mapStateToProps = state => ({
  params: getSampleParam(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({}, dispatch),
});

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export default AppContainer;
