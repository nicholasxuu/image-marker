/* eslint-disable function-paren-newline,prefer-const */
// Link.react-test.js
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import App from '../App';

test('sample component snapshot', () => {
  const component = renderer.create(
    <App />,
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('CheckboxWithLabel changes the text after click', () => {
  // Render a checkbox with label in the document
  const dom = shallow(<App />);

  expect(dom.text()).toEqual('hello world');
});
