import {render, RenderResult} from '@testing-library/react';
import React, {ReactElement} from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter, MemoryRouter} from 'react-router-dom';
import App from '../../components/App';
import {store} from '../../store';

export const renderWithRouter = (ui: ReactElement, {route = '/'} = {}): RenderResult => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, {wrapper: BrowserRouter});
};

export const renderRoute = (route: string): RenderResult =>
  renderWithRouter(
    <Provider store={store}>
      <App />
    </Provider>,
    {route}
  );

export const renderApp = (): RenderResult =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    {wrapper: MemoryRouter}
  );
