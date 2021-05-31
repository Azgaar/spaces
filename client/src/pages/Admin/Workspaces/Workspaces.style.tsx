import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  control: {
    margin: theme.spacing(0, 0, 0, 1)
  },
  selectedButton: {
    backgroundColor: theme.palette.primary.main
  }
}));

export default useStyles;
