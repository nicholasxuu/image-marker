/* eslint-disable no-unused-vars */
import Immutable from 'immutable';
import { SAMPLE_ACTION } from '../constants/ActionTypes';

const defaultValue = Immutable.fromJS({
});

const MarkedResultReducer = (state = defaultValue, action) => {
  switch (action.type) {
    case (SAMPLE_ACTION): {
      const nextState = state.set('param1', action.param1);
      return nextState;
    }
    default:
  }
  return state;
};

export default MarkedResultReducer;
