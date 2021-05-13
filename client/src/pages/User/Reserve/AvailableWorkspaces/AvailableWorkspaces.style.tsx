import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  progress: {
    width: '100%',
    margin: theme.spacing(1, 1, 0),
    height: theme.spacing(0.5)
  },
  inactive: {
    visibility: 'hidden'
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #00000050',
    padding: '1px'
  },
  selectedCard: {
    backgroundColor: '#e8eaf1',
    border: '2px solid ' + theme.palette.primary.main,
    padding: 0
  }
}));

export default useStyles;
