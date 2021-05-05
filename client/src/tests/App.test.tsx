import React from 'react';
import {cleanup, render, screen, waitFor, within} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import App from '../components/App';
import {Provider} from 'react-redux';
import {store} from '../store';

afterEach(cleanup);

describe('Unauthorized user', () => {
  test('sees Sign In form by default', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
      {wrapper: MemoryRouter}
    );

    await waitFor(() => {
      const main = screen.getByRole('main');
      const signIn = within(main).getByRole('button', {name: /sign in/i});
      screen.debug();
      expect(signIn).toBeInTheDocument();
    });
  });
});
