import { SAMPLE_ACTION } from '../constants/ActionTypes';

export const sampleLv1Action = (param1) => ({
  type: SAMPLE_ACTION,
  param1,
});

export const sampleLv2Action = param1 => (dispatch) => {
  dispatch(sampleLv1Action(param1));
};
