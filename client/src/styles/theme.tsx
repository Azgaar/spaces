import red from '@material-ui/core/colors/red';
import {createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2f45ac'
    },
    secondary: {
      main: '#2f45accc'
    },
    error: {
      main: red.A700
    },
    background: {
      default: '#fff'
    }
  }
});

export default theme;
