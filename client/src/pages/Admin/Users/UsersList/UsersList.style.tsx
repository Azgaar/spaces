import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    marginTop: theme.spacing(3),
    '& div.MuiDataGrid-root': {
      border: '1px solid #aaaaaa',
      color: '#000000',
      backgroundColor: '#fff',
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
    margin: theme.spacing(1, 0)
  }
}));

export default useStyles;
