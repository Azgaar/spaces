import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  list: {
    padding: theme.spacing(1, 0, 0, 0),
    fontSize: "smaller",
    "& .MuiListItemIcon-root": {
      minWidth: 0
    },
    "& .MuiListItem-dense": {
      padding: 0
    },
    "& .MuiListItemSecondaryAction-root": {
      right: theme.spacing(.5)
    },
    "& .MuiIconButton-root": {
      fontSize: "1.2rem"
    },
    "& .MuiInputBase-root": {
      fontSize: "inherit"
    }
  }
}));

export default useStyles;
