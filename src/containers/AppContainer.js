/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import App from '../components/main/App';
import { saveMarkedItemToGlobal } from '../actions/Global';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    onSaveMarkedItemList: saveMarkedItemToGlobal,
  }, dispatch),
});

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export default AppContainer;
