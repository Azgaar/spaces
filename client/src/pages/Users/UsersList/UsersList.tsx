import React, {useEffect, useState} from "react";
import useStyles from "./UsersList.style";
import {Button, Container} from "@material-ui/core";
import {DataGrid, GridColDef, GridRowId, GridSelectionModelChangeParams} from "@material-ui/data-grid";
import {MessageType, useMessage} from "../../../components/providers/MessageProvider";
import axios from "axios";

const columns: GridColDef[] = [
  {field: "role", headerName: "Role", width: 90},
  {field: "firstName", headerName: "First name", width: 130},
  {field: "lastName", headerName: "Last name", width: 130},
  {field: "email", headerName: "Email", width: 240},
  {field: "created", headerName: "Created at", type: "dateTime", width: 240},
  {field: "updated", headerName: "Updated at", type: "dateTime", width: 240},
];

const UsersList = () => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [isLoading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selection, setSelection] = useState([] as GridRowId[]);

  useEffect(() => {
    axios.post("/getUsers", {}, {withCredentials: true})
      .then(res => setUsers(() => res.data))
      .catch(err => pushMessage({title: err.message, type: MessageType.ERROR}))
      .then(() => setLoading(false));
  }, []);

  const handleSelection = ((selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);
  });

  const handleUsersDeletion = () => {
    setLoading(true);
    axios.delete("/deleteUsers", {data: selection, withCredentials: true})
      .then(res => {
        if (!res.data.users) throw Error("Cannot fetch users");
        setUsers(() => res.data.users);
      })
      .catch(err => pushMessage({title: err.message, type: MessageType.ERROR}))
      .then(() => setLoading(false));
  }

  return (
    <Container className={classes.container}>
      <DataGrid rows={users} columns={columns} pageSize={6} rowsPerPageOptions={[6, 12, 24, 48]}
        getRowId={(row) => row.email} autoHeight checkboxSelection loading={isLoading} onSelectionModelChange={handleSelection} />
      {selection.length > 0 && <Button variant="contained" color="primary" className={classes.action} onClick={handleUsersDeletion}>Delete user{selection.length > 1 && "s"}</Button>}
    </Container>
  );
};

export default UsersList;
