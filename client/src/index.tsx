import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import axios from 'axios';
import {store} from './store';
import AuthProvider from './components/Providers/AuthProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import {ThemeProvider} from '@material-ui/core/styles';
import theme from './styles/theme';
import {MessageProvider} from './components/Providers/MessageProvider';
import App from './components/App';
import {BASE_URL, REQUEST_TIMEOUT} from './config';
import DayJSUtils from '@date-io/dayjs';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <MessageProvider>
              <MuiPickersUtilsProvider utils={DayJSUtils}>
                <App />
              </MuiPickersUtilsProvider>
            </MessageProvider>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
  document.querySelector('#root')
);

axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = REQUEST_TIMEOUT;
axios.defaults.withCredentials = true;
