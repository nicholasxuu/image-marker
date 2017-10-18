/* eslint-disable no-unused-vars */
import Immutable from 'immutable';
import { SAMPLE_ACTION } from '../constants/ActionTypes';

const defaultValue = Immutable.fromJS({
});

const SampleReducer = (state = defaultValue, action) => {
  if (action.type === SAMPLE_ACTION) {
    const nextState = state.set('param1', action.param1);
    return nextState;
  }
  return state;
};

export default SampleReducer;
