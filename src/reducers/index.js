import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import MarkedResultReducer from './MarkedResultReducer';

const TotalReducer = combineReducers({
  markedResult: MarkedResultReducer,
  router: routerReducer, // react router redux
});

export default TotalReducer;
