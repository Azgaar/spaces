import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  box: {
    '& > *': {
      margin: theme.spacing(0, 1, 0, 0)
    }
  },
  text: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
    [theme.breakpoints.up('md')]: {
      display: 'none'
    },
    [theme.breakpoints.up('lg')]: {
      display: 'inline-block'
    }
  }
}));

export default useStyles;
