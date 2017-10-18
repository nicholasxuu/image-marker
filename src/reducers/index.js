import { combineReducers } from 'redux';
import SampleReducer from './SampleReducer';

const TotalReducer = combineReducers({
  SampleReducer,
});

export default TotalReducer;
