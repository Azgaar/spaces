import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    margin: theme.spacing(3, 0, 1, 0)
  },
  title: {
    fontSize: theme.spacing(0.8)
  },
  card: {
    padding: theme.spacing(0, 0, 1, 0),
    border: '1px solid #ccc'
  },
  cardHeader: {
    '& .MuiCardHeader-subheader': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      maxWidth: '12em'
    }
  },
  content: {
    padding: theme.spacing(1, 2, 0, 2)
  }
}));

export default useStyles;
