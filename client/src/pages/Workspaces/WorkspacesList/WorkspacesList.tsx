import React, {useEffect, useState} from "react";
import useStyles from "./WorkspacesList.style";
import {Button, Container} from "@material-ui/core";
import {DataGrid, GridColDef, GridRowId, GridSelectionModelChangeParams} from "@material-ui/data-grid";
import DeletionButton from "../../../components/Controls/DeletionButton/DeletionButton";
import {MessageType, useMessage} from "../../../components/providers/MessageProvider";
import {LocationOption, Workspace, WorkspaceStatus, WorkspaceType} from "../../../types";
import {WorkspaceService} from "../../../services";
import {useRequest} from "../../../hooks";

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
  const [workspaces, setWorkspaces] = useState([] as Workspace[]);
  const [selection, setSelection] = useState([] as GridRowId[]);
  const {isLoading, setLoading, handleRequest} = useRequest();

  useEffect(() => {
    async function fetchWorkspaces() {
      const workspaces = await handleRequest(WorkspaceService.list(loc));
      if (workspaces) setWorkspaces(() => workspaces);
    };

    if (loc.id) {
      fetchWorkspaces();
    } else {
      setLoading(() => false);
      setWorkspaces(() => []);
    }
  }, [loc]);

  const handleSelection = ((selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);
  });

  const addWorkspace = async () => {
    const workspace: Workspace = {
      description: "WS_" + workspaces.length,
      location: loc.id,
      status: WorkspaceStatus.AVAILABLE,
      type: WorkspaceType.DESK,
      size: 1,
      equipment: []
    };

    const addedWorkspace = await handleRequest(WorkspaceService.add(workspace));
    if (!addedWorkspace) return;
    setWorkspaces(workspaces => [...workspaces, addedWorkspace]);
    pushMessage({title: `Workspace "${addedWorkspace.description}" is added`, type: MessageType.SUCCESS});
  }

  const handleDeletion = async () => {
    const remainingWorkspaces = await handleRequest(WorkspaceService.remove(selection));
    if (remainingWorkspaces) {
      setSelection(() => [] as GridRowId[]);
      const title = selection.length > 1 ? "Workspaces are deleted" : "Workspace is deleted";
      pushMessage({title, type: MessageType.SUCCESS});
    }
  }

  return (
    <Container className={classes.container}>
      <DataGrid rows={workspaces} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20, 40]}
        autoHeight checkboxSelection loading={isLoading} onSelectionModelChange={handleSelection} />
      <Container className={classes.controls}>
        {Boolean(loc.id) && <Button variant="contained" color="primary" onClick={addWorkspace}>Add</Button>}
        {Boolean(selection.length) && <DeletionButton onDelete={handleDeletion} object={selection.length > 1 ? "workspaces" : "workspace"} />}
      </Container>
    </Container>
  );
};

export default WorkspacesList;
