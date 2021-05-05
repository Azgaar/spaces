import {cleanup, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderRoute} from './utils';

afterEach(cleanup);

describe('Sign up page', () => {
  test('has submit button', async () => {
    renderRoute('/signup');
    const signUp = await screen.findByRole('button', {name: /sign up/i});
    expect(signUp).toBeInTheDocument();
  });

  test('has valid link to Terms of use', async () => {
    renderRoute('/signup');
    const terms_link = await screen.findByText(/terms of use/i);
    expect(terms_link).toBeInTheDocument();
    userEvent.click(terms_link);
    const terms_heading = await screen.findByRole('heading', {name: /terms of use/i});
    expect(terms_heading).toBeInTheDocument();
  });

  test('has valid link to Privacy policy', async () => {
    renderRoute('/signup');
    const privacy_link = await screen.findByText(/privacy policy/i);
    expect(privacy_link).toBeInTheDocument();
    userEvent.click(privacy_link);
    const privacy_heading = await screen.findByRole('heading', {name: /privacy policy/i});
    expect(privacy_heading).toBeInTheDocument();
  });
});
