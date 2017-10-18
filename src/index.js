/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import './index.css';
import configureStore from './store';
import BrowserRouter, { history } from './components/main/BrowserRouter';
import App from './components/main/AppContainer';

const store = configureStore(history);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route exact path="/" component={App} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
