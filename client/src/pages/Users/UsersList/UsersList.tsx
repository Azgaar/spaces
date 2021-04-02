import React, {useEffect, useState} from "react";
import useStyles from "./UsersList.style";
import {Container} from "@material-ui/core";
import {DataGrid, GridColDef} from "@material-ui/data-grid";
//import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";

const columns: GridColDef[] = [
  {field: "role", headerName: "Role", width: 90},
  {field: "firstName", headerName: "First name", width: 130},
  {field: "lastName", headerName: "Last name", width: 130},
  {field: "email", headerName: "Email", width: 200},
];

type UserData = {
  email: string,
  firstName: string,
  lastName: string,
  role: string
}

const UsersList = () => {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  });

  const users: Array<UserData> = [
    {
      email: "test@user1.com",
      firstName: "Test1",
      lastName: "User1",
      role: "user"
    },
    {
      email: "test@user2.com",
      firstName: "Test2",
      lastName: "User2",
      role: "user"
    },
    {
      email: "test@user3.com",
      firstName: "Test3",
      lastName: "User3",
      role: "user"
    },
    {
      email: "test@user4.com",
      firstName: "Test4",
      lastName: "User4",
      role: "user"
    },
    {
      email: "test@user5.com",
      firstName: "Test5",
      lastName: "User5",
      role: "user"
    }
  ];

  return (
    <Container className={classes.container}>
      <DataGrid rows={users} columns={columns} pageSize={20}
        getRowId={(row) => row.email} autoHeight autoPageSize checkboxSelection loading={isLoading} />
    </Container>
  );
};

export default UsersList;
