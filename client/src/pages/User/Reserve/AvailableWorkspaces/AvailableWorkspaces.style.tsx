import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  card: {
    backgroundColor: "#ffffff40",
    border: "1px solid #00000040"
  },
  selectedCard: {
    backgroundColor: theme.palette.primary.main + "20",
    border: "1px solid " + theme.palette.primary.main
  },
  cardHeader: {
    "& .MuiCardHeader-subheader": {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      maxWidth: "12em"
    }
  }
}));

export default useStyles;
