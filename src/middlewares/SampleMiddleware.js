/* eslint-disable arrow-body-style,no-unused-vars */
const SampleMiddleware = store => next => (action) => {
  return next(action);
};

export default SampleMiddleware;
