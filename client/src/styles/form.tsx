import {makeStyles} from "@material-ui/core/styles";

const useFormStyles = makeStyles(theme => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#ffffff30",
    boxShadow: "0 0 10px 10px #ffffff30"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  }
}));

export default useFormStyles;
