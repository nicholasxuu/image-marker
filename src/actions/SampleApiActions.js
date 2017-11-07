import 'isomorphic-fetch'; // use this so fetchMock works.

import {
  SAMPLE_FETCH_FAILURE, SAMPLE_FETCH_REQUEST, SAMPLE_FETCH_SUCCESS,
} from '../constants/ActionTypes';

export const sampleFetchRequest = () => ({
  type: SAMPLE_FETCH_REQUEST,
});

export const sampleFetchFailure = error => ({
  type: SAMPLE_FETCH_FAILURE,
  error,
});

export const sampleFetchSuccess = body => ({
  type: SAMPLE_FETCH_SUCCESS,
  body,
});

export const sampleFetch = () => (dispatch) => {
  dispatch(sampleFetchRequest());
  return fetch(`${process.env.REACT_APP_SERVER_ADDR}/test`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((err) => { throw err; });
    })
    .then(json => dispatch(sampleFetchSuccess(json)))
    .catch(ex => dispatch(sampleFetchFailure(ex)));
};
