import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  listItem: {
    '& > p': {
      width: '23%'
    },
    '& > div': {
      width: '33%'
    }
  }
}));

export default useStyles;
