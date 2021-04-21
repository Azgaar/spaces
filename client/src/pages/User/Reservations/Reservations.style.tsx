import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }
}));

export default useStyles;
