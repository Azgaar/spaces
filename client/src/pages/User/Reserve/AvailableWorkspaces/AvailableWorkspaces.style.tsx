import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  card: {
    backgroundColor: "#ffffffdd",
    border: "1px solid #00000050",
    padding: "1px"
  },
  selectedCard: {
    backgroundColor: "#ffffff",
    border: "2px solid " + theme.palette.primary.main,
    padding: 0
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
