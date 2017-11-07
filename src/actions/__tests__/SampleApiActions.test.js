import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import * as actions from '../SampleApiActions';
import * as types from '../../constants/ActionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('sample fetch actions', () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('sample fetch success', () => {
    fetchMock
      .getOnce(
        `${process.env.REACT_APP_SERVER_ADDR}/test`,
        {
          headers: { 'content-type': 'application/json' },
          body: {
            msg: 'good',
          },
        },
      );

    const expectedActions = [
      { type: types.SAMPLE_FETCH_REQUEST },
      { type: types.SAMPLE_FETCH_SUCCESS, body: { msg: 'good' } },
    ];
    const store = mockStore({});

    return store
      .dispatch(actions.sampleFetch())
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('sample fetch fails', () => {
    fetchMock
      .getOnce(
        `${process.env.REACT_APP_SERVER_ADDR}/test`,
        {
          headers: { 'content-type': 'application/json' },
          status: 500,
          body: {
            error: 'str.err',
          },
        },
      );

    const expectedActions = [
      { type: types.SAMPLE_FETCH_REQUEST },
      { type: types.SAMPLE_FETCH_FAILURE, error: { error: 'str.err' } },
    ];
    const store = mockStore({});

    return store
      .dispatch(actions.sampleFetch())
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
