import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import SampleReducer from './SampleReducer';

const TotalReducer = combineReducers({
  SampleReducer,
  router: routerReducer, // react router redux
});

export default TotalReducer;
