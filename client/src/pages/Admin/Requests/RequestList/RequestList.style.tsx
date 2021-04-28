import {makeStyles} from "@material-ui/core/styles";
import {green, red, yellow} from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    marginTop: theme.spacing(1),
    "& div.MuiDataGrid-root": {
      border: "1px solid #aaaaaa",
      color: "#000000",
      backgroundColor: "#f2f2f2aa",
      boxShadow: "0 0 20px 5px #f2f2f2aa"
    },
    "& div.MuiDataGrid-cell": {
      borderBottom: "1px solid #aaaaaa"
    },
    "& div.MuiDataGrid-columnsContainer": {
      backgroundColor: "#8c93a94a",
      borderBottom: `1px solid ${theme.palette.primary.main}`
    },
    "& div.MuiDataGrid-columnSeparator": {
      color: theme.palette.primary.main
    },
    "& div.MuiDataGrid-colCellTitle": {
      fontWeight: 700
    }
  },
  controls: {
    margin: theme.spacing(1, 0),
    "& button": {
      marginRight: theme.spacing(1)
    }
  },
  green: {
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
      "@media (hover: none)": {
        backgroundColor: green[500]
      }
    }
  },
  red: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],
      "@media (hover: none)": {
        backgroundColor: red[500]
      }
    }
  },
  yellow: {
    color: theme.palette.getContrastText(yellow[500]),
    backgroundColor: yellow[500],
    "&:hover": {
      backgroundColor: yellow[700],
      "@media (hover: none)": {
        backgroundColor: yellow[500]
      }
    }
  }
}));

export default useStyles;
