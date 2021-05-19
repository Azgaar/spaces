import {makeStyles} from '@material-ui/core/styles';

const useFormStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3)
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  label: {
    fontSize: '.85em',
    margin: theme.spacing(0, 0, 0.2, 1.6)
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing(0.4)
  },
  buttons: {
    marginTop: theme.spacing(1)
  }
}));

export default useFormStyles;
