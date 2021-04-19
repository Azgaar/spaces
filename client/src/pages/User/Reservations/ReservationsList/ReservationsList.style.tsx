import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  title: {
    fontSize: theme.spacing(0.8)
  },
  cardHeader: {
    "& .MuiCardHeader-subheader": {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      maxWidth: "12em"
    }
  },
  content: {
    padding: theme.spacing(1, 2, 0, 2)
  }
}));

export default useStyles;
