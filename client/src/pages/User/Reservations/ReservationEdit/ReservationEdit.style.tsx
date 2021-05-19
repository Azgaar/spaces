import {makeStyles} from '@material-ui/core/styles';

const useFormStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2, 3, 3)
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  buttons: {
    marginTop: theme.spacing(1)
  }
}));

export default useFormStyles;
