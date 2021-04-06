import React, {useEffect, useState} from "react";
import useStyles from "./WorkspacesList.style";
import {Container} from "@material-ui/core";
import {DataGrid, GridColDef, GridRowId, GridSelectionModelChangeParams} from "@material-ui/data-grid";
import {MessageType, useMessage} from "../../../components/providers/MessageProvider";
import axios, {AxiosPromise} from "axios";
import {LocationOption } from "../../../types";

const columns: GridColDef[] = [
  {field: "status", headerName: "Status", width: 160},
  {field: "description", headerName: "Title", width: 240},
  {field: "type", headerName: "Type", width: 200},
  {field: "size", headerName: "Size", width: 120},
  {field: "equipment", headerName: "Equipment", width: 340},
];

const WorkspacesList = (props: {location: LocationOption}) => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [isLoading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [selection, setSelection] = useState([] as GridRowId[]);

  const handleRequest = async (request: AxiosPromise) => {
    setLoading(true);
    try {
      const res = await request;
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      pushMessage({title: message, type: MessageType.ERROR});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchWorkspaces() {
      const res = await handleRequest(axios.post("/getWorkspaces", {location: props.location}, {withCredentials: true}));
      if (res) setWorkspaces(() => res);
    };
    fetchWorkspaces();
  }, [props.location]);

  const handleSelection = ((selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);
  });

  return (
    <Container className={classes.container}>
      <DataGrid rows={workspaces} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20, 40]}
        getRowId={(row) => row.email} autoHeight checkboxSelection loading={isLoading} onSelectionModelChange={handleSelection} />
    </Container>
  );
};

export default WorkspacesList;
