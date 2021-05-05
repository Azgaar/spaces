import {cleanup, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderApp} from './utils';

afterEach(cleanup);

describe('App header', () => {
  test('contains logo', async () => {
    renderApp();
    const logo = await screen.findByRole('img', {name: /logo/i});
    expect(logo).toBeInTheDocument();
  });

  test('contains applicaiton name', async () => {
    renderApp();
    const title = await screen.findByRole('heading', {name: /spʌces/i});
    expect(title).toBeInTheDocument();
  });

  test('has menu as a drawer', async () => {
    renderApp();
    const menu = await screen.findByText(/menu/i);
    userEvent.click(menu); // open drawer
    const presentation = screen.getByRole('presentation');
    expect(presentation).toBeInTheDocument();
  });

  test('has valid menu link to Sign In', async () => {
    renderApp();
    const menu = await screen.findByText(/menu/i);
    userEvent.click(menu); // open drawer
    const signIn_menuItem = await screen.findByRole('menuitem', {name: /sign in/i});
    expect(signIn_menuItem).toBeInTheDocument();
    userEvent.click(signIn_menuItem);
    const signIn_header = await screen.findByRole('heading', {name: /sign in/i});
    expect(signIn_header).toBeInTheDocument();
  });

  test('has valid menu link to Sign Up', async () => {
    renderApp();
    const menu = await screen.findByText(/menu/i);
    userEvent.click(menu); // open drawer
    const signUp_menuItem = await screen.findByRole('menuitem', {name: /sign up/i});
    expect(signUp_menuItem).toBeInTheDocument();
    userEvent.click(signUp_menuItem);
    const signUp_header = await screen.findByRole('heading', {name: /sign up/i});
    expect(signUp_header).toBeInTheDocument();
  });
});
