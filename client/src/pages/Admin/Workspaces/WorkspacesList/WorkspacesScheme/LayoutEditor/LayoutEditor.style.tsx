import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  accordion: {
    '& .MuiAccordionDetails-root': {
      padding: theme.spacing(0, 0, 1, 0),
      display: 'block'
    }
  },
  accordionButton: {
    float: 'right'
  }
}));

export default useStyles;
