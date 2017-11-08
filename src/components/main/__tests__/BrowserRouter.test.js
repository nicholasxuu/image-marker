/* eslint-disable function-paren-newline */
import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router';
import BrowserRouter from '../BrowserRouter';
import App from '../App';

it('renders correct routes', () => {
  const wrapper = shallow(
    <BrowserRouter>
      <Route exact path="/test" component={App} />
    </BrowserRouter>,
  );
  const pathMap = wrapper.find(Route).reduce((currPathMap, route) => {
    const nextPathMap = currPathMap;
    const routeProps = route.props();
    nextPathMap[routeProps.path] = routeProps.component;
    return nextPathMap;
  }, {});

  expect(pathMap['/test']).toBe(App);
});
