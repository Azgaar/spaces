import {makeStyles} from '@material-ui/core/styles';

const useFormStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1, 3),
    marginTop: theme.spacing(9)
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  buttons: {
    margin: theme.spacing(2, 0, 2)
  }
}));

export default useFormStyles;
