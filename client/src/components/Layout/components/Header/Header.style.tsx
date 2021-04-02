import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  header: {
    backgroundColor: "#000000b3",
    color: "white"
  },
  logo: {
    height: "3em"
  },
  buttons: {
    marginLeft: "auto",
    "& a": {
      padding: theme.spacing(0, 0.8)
    }
  }
}));

export default useStyles;
