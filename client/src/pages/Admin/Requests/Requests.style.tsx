import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  topControlSection: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    padding: theme.spacing(0, 3),
    zIndex: 2
  },
  selectedButton: {
    "backgroundColor": theme.palette.primary.main
  }
}));

export default useStyles;
