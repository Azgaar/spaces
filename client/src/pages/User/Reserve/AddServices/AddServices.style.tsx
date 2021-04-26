import {makeStyles} from "@material-ui/core/styles";

const useFormStyles = makeStyles(theme => ({
  paper: {
    width: "340px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(3)
  },
  form: {
    marginTop: theme.spacing(3)
  },
  list: {
    padding: theme.spacing(1, 0),
    maxHeight: "50vh",
    overflow: "auto"
  }
}));

export default useFormStyles;
