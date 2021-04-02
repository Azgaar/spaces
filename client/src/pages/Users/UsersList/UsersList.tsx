import React from "react";
import useStyles from "./UsersList.style";
import {Container} from "@material-ui/core";
import {DataGrid, GridColDef} from "@material-ui/data-grid";
//import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";

const columns: GridColDef[] = [
  {field: "id", type:"string", headerName: "id", width: 1},
  {field: "role", headerName: "Role", width: 70},
  {field: "firstName", headerName: "First name", width: 130},
  {field: "lastName", headerName: "Last name", width: 130},
  {field: "email", headerName: "Email", width: 200},
];

type UserData = {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  role: string
}

const UsersList = ({users}: {users: Array<UserData>}) => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <DataGrid rows={users} columns={columns} pageSize={20} checkboxSelection />
    </Container>
  );
};

export default UsersList;
