import {act, cleanup, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderRoute} from './utils';

afterEach(cleanup);

describe('Sign up form', () => {
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

  test('shows missing value errors', async () => {
    renderRoute('/signup');
    const signUp = await screen.findByRole('button', {name: /sign up/i});
    act(() => userEvent.click(signUp));
    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password confirmation is required/i)).toBeInTheDocument();
    expect(screen.getByText(/please read and accept the tems of use and privacy policy/i)).toBeInTheDocument();
  });

  test('accepts vaid inputs', async () => {
    renderRoute('/signup');

    const signUp = await screen.findByRole('button', {name: /sign up/i});
    const firstName = screen.getByRole('textbox', {name: /first name/i});
    const lastName = screen.getByRole('textbox', {name: /last name/i});
    const email = screen.getByRole('textbox', {name: /email/i});
    const password = screen.getAllByLabelText(/password \*/i)[0];
    const passwordRepeat = screen.getByLabelText(/repeat/i);
    const acceptTerms = screen.getByRole('checkbox', {name: /accept/i});

    await act(async () => {
      userEvent.type(firstName, 'firstNameTest');
      userEvent.type(lastName, 'lastNameTest');
      userEvent.type(email, 'test.user@mail.com');
      userEvent.type(password, 'testPassword');
      userEvent.type(passwordRepeat, 'testPassword');
      userEvent.click(acceptTerms);
      userEvent.click(signUp);

      expect(screen.queryByText(/first name is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/last name is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/password is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/password confirmation is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/please read and accept the tems of use and privacy policy/i)).not.toBeInTheDocument();
    });
  });
});
