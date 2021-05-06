import {cleanup, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderApp} from './utils';

afterEach(cleanup);

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
