/* eslint-disable function-paren-newline,prefer-const */
// Link.react-test.js
import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

test('sample component snapshot', () => {
  const component = renderer.create(
    <App />,
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
