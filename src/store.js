/* eslint-disable no-unused-vars */
/* eslint-env browser */
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import Immutable from 'immutable';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux';
import UserManagerReducer from './reducers/index';

const loggerMiddleware = createLogger({
  actionTransformer: (action) => {
    const newAction = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const i of Object.keys(action)) {
      if (Immutable.Iterable.isIterable(action[i])) {
        newAction[i] = action[i].toJS();
      } else {
        newAction[i] = action[i];
      }
    }

    return newAction;
  },
  // needed to convert logged immutableJS state to readable objects.
  stateTransformer: (state) => {
    const newState = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const i of Object.keys(state)) {
      if (Immutable.Iterable.isIterable(state[i])) {
        newState[i] = state[i].toJS();
      } else {
        newState[i] = state[i];
      }
    }

    return newState;
  },
});


export default function configureStore(history) {
  const preloadState = {};

  const reactRouterMiddleware = routerMiddleware(history);

  /**
   * Create store
   */
  const store = createStore(
    UserManagerReducer,
    preloadState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware,
      reactRouterMiddleware,
    ),
  );


  return store;
}

