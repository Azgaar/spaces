import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    marginTop: theme.spacing(4),
    backgroundColor: "#00000020",
    boxShadow: "0 0 30px 20px #00000020",
    "& div.MuiInputBase-root": {
      backgroundColor: "#ffffffdd"
    }
  },
  typeAny: {
    fontStyle: "italic"
  },
  multiSelect: {
    width: "100%"
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
  controls: {
    marginTop: theme.spacing(1)
  }
}));

export default useStyles;
