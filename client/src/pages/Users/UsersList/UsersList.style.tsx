import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    marginTop: theme.spacing(3),
    "& div.MuiDataGrid-root": {
      border: "1px solid #aaaaaa",
      color: "#000000fa",
      backgroundColor: "#e6e6e699",
      boxShadow: "0 0 25px 15px #e6e6e699"
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
  deletion: {
    margin: theme.spacing(1, 0),
    "& > *": {
      margin: theme.spacing(0, 1, 0, 0)
    }
  }
}));

export default useStyles;
