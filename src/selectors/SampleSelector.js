import { createSelector } from 'reselect';

const getParams = state => state.sample.has('param') ? state.sample.get('params') : [];

// eslint-disable-next-line import/prefer-default-export
export const getSampleParam = createSelector(
  getParams,
  params => params.filter(item => item.substr(0, 5) === 'param'),
);
