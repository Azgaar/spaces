import React from 'react';
import {cleanup, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import App from '../components/App';
import {Provider} from 'react-redux';
import {store} from '../store';
import userEvent from '@testing-library/user-event';

afterEach(cleanup);

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    {wrapper: MemoryRouter}
  );

describe('Sign in page', () => {
  test('has submit button', async () => {
    renderApp();
    const signIn = await screen.findByRole('button', {name: /sign in/i});
    expect(signIn).toBeInTheDocument();
  });

  test('has valid link to Forgot Password', async () => {
    renderApp();
    const forgotPassword = await screen.findByRole('link', {name: /forgot password/i});
    expect(forgotPassword).toBeInTheDocument();
    userEvent.click(forgotPassword);
    const forgotPasswordHeader = await screen.findByRole('heading', {name: /forgot password/i});
    expect(forgotPasswordHeader).toBeInTheDocument();
  });

  test('has valid link to Sign Up', async () => {
    renderApp();
    const signUp = await screen.findByRole('link', {name: /sign up/i});
    expect(signUp).toBeInTheDocument();
    userEvent.click(signUp);
    const signUpHeading = await screen.findByRole('heading', {name: /sign up/i});
    expect(signUpHeading).toBeInTheDocument();
  });
});
