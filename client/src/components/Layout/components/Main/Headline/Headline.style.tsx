import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  header: {
    zIndex: 1
  }
}));

export default useStyles;
