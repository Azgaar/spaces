import React, {useEffect, useState} from "react";
import useStyles from "./WorkspacesList.style";
import {Container} from "@material-ui/core";
import {DataGrid, GridColDef, GridRowId, GridSelectionModelChangeParams} from "@material-ui/data-grid";
import DeletionButton from "../../../components/Controls/DeletionButton/DeletionButton";
import {MessageType, useMessage} from "../../../components/providers/MessageProvider";
import {LocationOption} from "../../../types";
import {WorkspaceService} from "../../../services";
import { useRequest } from "../../../hooks";

const columns: GridColDef[] = [
  {field: "status", headerName: "Status", width: 160},
  {field: "description", headerName: "Title", width: 240},
  {field: "type", headerName: "Type", width: 200},
  {field: "size", headerName: "Size", width: 120},
  {field: "equipment", headerName: "Equipment", width: 340},
];

const WorkspacesList = ({loc}: {loc: LocationOption}) => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [workspaces, setWorkspaces] = useState([]);
  const [selection, setSelection] = useState([] as GridRowId[]);
  const {isLoading, error, handleRequest} = useRequest();

  useEffect(() => {
    async function fetchWorkspaces() {
      const res = await handleRequest(WorkspaceService.list(loc));
      if (res) setWorkspaces(() => res);
      else pushMessage({title: error, type: MessageType.ERROR});
    };

    loc.id ? fetchWorkspaces() : setWorkspaces(() => []);
  }, [loc]);

  const handleSelection = ((selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);
  });

  const handleDeletion = async () => {
    const remainingWorkspaces = await handleRequest(WorkspaceService.remove(selection));
    if (remainingWorkspaces) {
      setSelection(() => [] as GridRowId[]);
      const title = selection.length > 1 ? "Workspaces are deleted" : "Workspace is deleted";
      pushMessage({title, type: MessageType.SUCCESS});
    } else {
      pushMessage({title: error, type: MessageType.ERROR});
    }
  }

  return (
    <Container className={classes.container}>
      <DataGrid rows={workspaces} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20, 40]}
        getRowId={(row) => row.email} autoHeight checkboxSelection loading={isLoading} onSelectionModelChange={handleSelection} />
      <Container className={classes.controls}>
        {Boolean(selection.length) && <DeletionButton onDelete={handleDeletion} object={selection.length > 1 ? "workspaces" : "workspace"} />}
      </Container>
    </Container>
  );
};

export default WorkspacesList;
