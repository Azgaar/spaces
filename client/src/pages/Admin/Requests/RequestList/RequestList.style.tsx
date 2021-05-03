import {makeStyles} from '@material-ui/core/styles';
import {green, red, yellow} from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    marginTop: theme.spacing(1),
    '& div.MuiDataGrid-root': {
      border: '1px solid #aaaaaa',
      color: '#000000',
      backgroundColor: '#f2f2f2aa',
      boxShadow: '0 0 20px 5px #f2f2f2aa'
    },
    '& div.MuiDataGrid-cell': {
      borderBottom: '1px solid #aaaaaa'
    },
    '& div.MuiDataGrid-columnsContainer': {
      backgroundColor: '#8c93a94a',
      borderBottom: `1px solid ${theme.palette.primary.main}`
    },
    '& div.MuiDataGrid-columnSeparator': {
      color: theme.palette.primary.main
    },
    '& div.MuiDataGrid-colCellTitle': {
      fontWeight: 700
    }
  },
  controls: {
    margin: theme.spacing(1, 0),
    '& button': {
      marginRight: theme.spacing(1)
    }
  },
  green: {
    color: theme.palette.getContrastText(green[700]),
    backgroundColor: green[700],
    '&:hover': {
      backgroundColor: green[900],
      '@media (hover: none)': {
        backgroundColor: green[700]
      }
    }
  },
  red: {
    color: theme.palette.getContrastText(red[700]),
    backgroundColor: red[700],
    '&:hover': {
      backgroundColor: red[900],
      '@media (hover: none)': {
        backgroundColor: red[700]
      }
    }
  },
  yellow: {
    color: theme.palette.getContrastText(yellow[700]),
    backgroundColor: yellow[700],
    '&:hover': {
      backgroundColor: yellow[900],
      '@media (hover: none)': {
        backgroundColor: yellow[700]
      }
    }
  }
}));

export default useStyles;
