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
    backgroundColor: "#ffffff20",
    boxShadow: "0 0 40px 50px #ffffff20",
    "& div.MuiTextField-root, & .MuiSelect-root": {
      backgroundColor: "#ffffff40"
    }
  },
  label: {
    fontSize: ".85em",
    margin: theme.spacing(-1.54, 0, .2, 1.6)
  },
  typeAny: {
    fontStyle: "italic"
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
  }
}));

export default useStyles;
