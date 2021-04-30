import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  header: {
    backgroundColor: "#000000b3",
    color: "white"
  },
  logo: {
    height: "3em"
  },
  title: {
    flexGrow: 1
  },
  drawer: {
    fontSize: "bigger",
    "& .MuiDrawer-paper": {
      minWidth: "160px",
      fontSize: "large"
    },
    "& .MuiMenuItem-root": {
      fontWeight: 600
    }
  }
}));

export default useStyles;
