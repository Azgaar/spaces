import {makeStyles} from "@material-ui/core/styles";

const useFormStyles = makeStyles(theme => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(3)
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  label: {
    fontSize: ".85em",
    margin: theme.spacing(0, 0, .2, 1.6)
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing(.25),
    padding: theme.spacing(0, .5),
    "& span.MuiChip-label": {
      padding: theme.spacing(0, 1, 0, .5)
    }
  },
  buttons: {
    margin: theme.spacing(2, 0, 1)
  }
}));

export default useFormStyles;
