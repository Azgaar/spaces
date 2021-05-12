import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  box: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2)
  },
  avatar: {
    marginBottom: theme.spacing(1)
  },
  header: {
    zIndex: 1
  }
}));

export default useStyles;
