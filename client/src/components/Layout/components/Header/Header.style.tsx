import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  logo: {
    height: '3em'
  },
  title: {
    flexGrow: 1
  },
  drawer: {
    fontSize: 'bigger',
    '& .MuiDrawer-paper': {
      minWidth: '160px',
      fontSize: 'large'
    },
    '& .MuiMenuItem-root': {
      fontWeight: 600
    }
  }
}));

export default useStyles;
