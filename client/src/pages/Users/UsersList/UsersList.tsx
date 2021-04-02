import React, {useEffect, useState} from "react";
import useStyles from "./UsersList.style";
import {Container} from "@material-ui/core";
import {DataGrid, GridColDef} from "@material-ui/data-grid";
import {MessageType, useMessage} from "../../../components/providers/MessageProvider";
import axios from "axios";

const columns: GridColDef[] = [
  {field: "role", headerName: "Role", width: 90},
  {field: "firstName", headerName: "First name", width: 130},
  {field: "lastName", headerName: "Last name", width: 130},
  {field: "email", headerName: "Email", width: 240},
  {field: "created", headerName: "Created at", type: "dateTime", width: 240},
  {field: "updated", headerName: "Updadated at", type: "dateTime", width: 240},
];

const UsersList = () => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [isLoading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.post("/getUsers", {}, {withCredentials: true})
      .then(res => setUsers(() => res.data))
      .catch(err => pushMessage({title: err.message, type: MessageType.ERROR}))
      .then(() => setLoading(false));
  }, []);

  return (
    <Container className={classes.container}>
      <DataGrid rows={users} columns={columns} pageSize={6} rowsPerPageOptions={[6, 12, 24, 48]}
        getRowId={(row) => row.email} autoHeight checkboxSelection loading={isLoading} />
    </Container>
  );
};

export default UsersList;
