import {makeStyles} from '@material-ui/core/styles';

const useFormStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(9),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
    backgroundColor: '#d9d9d9ab',
    boxShadow: '0 0 40px 50px #d9d9d9ab'
  },
  buttons: {
    margin: theme.spacing(2, 0, 2)
  }
}));

export default useFormStyles;
