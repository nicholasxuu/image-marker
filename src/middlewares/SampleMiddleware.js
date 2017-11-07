/* eslint-disable arrow-body-style,no-unused-vars */
const SampleMiddleware = ({ dispatch, getState }) => next => (action) => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }

  return next(action);
};

export default SampleMiddleware;
