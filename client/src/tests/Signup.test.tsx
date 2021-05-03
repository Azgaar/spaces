import React from 'react';
import {render as rtlRender, screen, within} from '@testing-library/react';
import {BrowserRouter as Router} from 'react-router-dom';
import App from '../components/App';

const render = (ui: JSX.Element, {route = '/'} = {}) => {
  window.history.pushState({}, 'Test page', route);
  return rtlRender(ui, {wrapper: Router});
};

test('renders app sign up page with sign up button', () => {
  render(<App />, {route: '/signup'});
  const main = screen.getByRole('main');
  const signUp = within(main).getByRole('button', {name: /sign up/i});
  expect(signUp).toBeInTheDocument();
});
