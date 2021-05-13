import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  box: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(2)
  },
  avatar: {
    marginBottom: theme.spacing(0.6)
  }
}));

export default useStyles;
