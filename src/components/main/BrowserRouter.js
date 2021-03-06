/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';

export const history = createHistory();

class BrowserRouter extends React.Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        {this.props.children}
      </ConnectedRouter>
    );
  }
}

BrowserRouter.defaultProps = {
  children: null,
};

BrowserRouter.propTypes = {
  children: PropTypes.node,
};

export default BrowserRouter;
