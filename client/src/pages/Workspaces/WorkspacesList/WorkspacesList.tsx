import React, {useEffect, useState} from "react";
import useStyles from "./WorkspacesList.style";
import {Button, Container, Typography} from "@material-ui/core";
import {DataGrid, GridColDef, GridRowId, GridSelectionModelChangeParams} from "@material-ui/data-grid";
import {MessageType, useMessage} from "../../../components/providers/MessageProvider";
import axios, {AxiosPromise} from "axios";

const columns: GridColDef[] = [
  {field: "role", headerName: "Role", width: 90},
  {field: "firstName", headerName: "First name", width: 130},
  {field: "lastName", headerName: "Last name", width: 130},
  {field: "email", headerName: "Email", width: 240},
  {field: "created", headerName: "Created at", type: "dateTime", width: 240},
  {field: "updated", headerName: "Updated at", type: "dateTime", width: 240},
];

const WorkspacesList = () => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [isLoading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selection, setSelection] = useState([] as GridRowId[]);

  const handleUsersRequest = (req: AxiosPromise) => {
    req.then(res => {
      if (!res.data) throw Error("Cannot fetch users");
      setUsers(() => res.data)
    })
    .catch(err => pushMessage({title: err.message, type: MessageType.ERROR}))
    .then(() => setLoading(false));
  };

  useEffect(() => {
    handleUsersRequest(axios.post("/getUsers", {}, {withCredentials: true}));
  }, []);

  const handleSelection = ((selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);
  });

  const handleUsersDeletion = () => {
    setLoading(true);
    handleUsersRequest(axios.delete("/deleteUsers", {data: selection, withCredentials: true}));
    setSelection(() => [] as GridRowId[]);
  }

  const DeletionButton = () => {
    const [confirmDelection, setConfirmDelection] = useState(false);

    if (selection.length < 1) return null;
    if (confirmDelection) return (
      <Container className={classes.deletion}>
        <Typography component="span" variant="body2" color="textPrimary">Are you sure you want to delete {selection.length > 1 ? "users" : "the user"}? The deletion cannot be rolled back</Typography>
        <Button variant="contained" color="primary" onClick={() => setConfirmDelection(() => false)}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleUsersDeletion}>Delete</Button>
      </Container>
    );
    return (
      <Container className={classes.deletion}>
        <Button variant="contained" color="primary" onClick={() => setConfirmDelection(() => true)}>Delete user{selection.length > 1 && "s"}</Button>
      </Container>
    );
  }

  return (
    <Container className={classes.container}>
      <DataGrid rows={users} columns={columns} pageSize={6} rowsPerPageOptions={[6, 12, 24, 48]}
        getRowId={(row) => row.email} autoHeight checkboxSelection loading={isLoading} onSelectionModelChange={handleSelection} />
      <DeletionButton />
    </Container>
  );
};

export default WorkspacesList;
