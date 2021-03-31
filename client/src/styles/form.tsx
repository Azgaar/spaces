import {makeStyles} from "@material-ui/core/styles";

const useFormStyles = makeStyles(theme => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  paper: {
    marginTop: theme.spacing(9),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#d9d9d9ab",
    boxShadow: "0 0 40px 50px #d9d9d9ab"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  buttons: {
    margin: theme.spacing(2, 0, 2),
  }
}));

export default useFormStyles;
