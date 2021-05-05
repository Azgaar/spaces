import React from 'react';
import {cleanup, render, screen, waitFor, within} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import App from '../components/App';
import {Provider} from 'react-redux';
import {store} from '../store';

afterEach(cleanup);

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    {wrapper: MemoryRouter}
  );

const waitForLazyLoading = () => waitFor(() => screen.getByRole('main'));

describe('Sign up page', () => {
  test('has submit button', async () => {
    renderApp();
    await waitForLazyLoading();
    const main = screen.getByRole('main');
    const signIn = within(main).getByRole('button', {name: /sign in/i});
    expect(signIn).toBeInTheDocument();
  });

  test('has link to Forgot Password', async () => {
    renderApp();
    await waitFor(() => {
      const main = screen.getByRole('main');
      const forgotPassword = within(main).getByRole('link', {name: /forgot password?/i});
      expect(forgotPassword).toBeInTheDocument();
    });
  });
});
