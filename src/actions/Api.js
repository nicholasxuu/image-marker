import 'isomorphic-fetch';
import {
  LOAD_MARKED_RESULT_FAILURE, LOAD_MARKED_RESULT_REQUEST, LOAD_MARKED_RESULT_SUCCESS,
  SAVE_MARKED_RESULT_FAILURE, SAVE_MARKED_RESULT_REQUEST, SAVE_MARKED_RESULT_SUCCESS,
} from '../constants/ActionTypes';


export const saveMarkedResultRequest = () => ({
  type: SAVE_MARKED_RESULT_REQUEST,
});

export const saveMarkedResultFailure = error => ({
  type: SAVE_MARKED_RESULT_FAILURE,
  error,
});

export const saveMarkedResultSuccess = body => ({
  type: SAVE_MARKED_RESULT_SUCCESS,
  body,
});

export const saveMarkedResult = (imageUrl, markedItemList) => (dispatch) => {
  console.log(imageUrl, markedItemList);

  dispatch(saveMarkedResultRequest());
  return fetch(`${process.env.REACT_APP_SERVER_ADDR}/save`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((err) => { throw err; });
    })
    .then(json => dispatch(saveMarkedResultSuccess(json)))
    .catch(ex => dispatch(saveMarkedResultFailure(ex)));
};


export const loadMarkedResultRequest = () => ({
  type: LOAD_MARKED_RESULT_REQUEST,
});

export const loadMarkedResultFailure = error => ({
  type: LOAD_MARKED_RESULT_FAILURE,
  error,
});

export const loadMarkedResultSuccess = body => ({
  type: LOAD_MARKED_RESULT_SUCCESS,
  body,
});

export const loadMarkedResult = () => (dispatch) => {
  dispatch(loadMarkedResultRequest());
  return fetch(`${process.env.REACT_APP_SERVER_ADDR}/load`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((err) => { throw err; });
    })
    .then(json => dispatch(loadMarkedResultSuccess(json)))
    .catch(ex => dispatch(loadMarkedResultFailure(ex)));
};
