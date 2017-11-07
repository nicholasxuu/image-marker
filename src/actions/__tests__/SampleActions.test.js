import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../SampleActions';
import * as types from '../../constants/ActionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('sample actions', () => {
  it('sample lv2 action', () => {
    const param1 = 'sample';
    const expectedActions = [
      { type: types.SAMPLE_ACTION, param1 },
    ];
    const store = mockStore({});

    store.dispatch(actions.sampleLv2Action(param1));

    expect(store.getActions()).toEqual(expectedActions);
  });

});
