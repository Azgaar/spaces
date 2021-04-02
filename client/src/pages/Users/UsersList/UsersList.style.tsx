import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    marginTop: theme.spacing(3),
    backgroundColor: "#d9d9d980",
    boxShadow: "0 0 40px 50px #d9d9d980",
    "& div.MuiDataGrid-root": {
      border: "1px solid #aaaaaa",
      color: "#000000fa"
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
  }
}));

export default useStyles;
