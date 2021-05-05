import {cleanup, screen, waitFor, within} from '@testing-library/react';
import {renderApp} from './utils';

afterEach(cleanup);

describe('App', () => {
  test('renders Sign Up page be default', async () => {
    renderApp();
    await waitFor(() => {
      const main = screen.getByRole('main');
      const signIn = within(main).getByRole('button', {name: /sign in/i});
      expect(signIn).toBeInTheDocument();
    });
  });
});
