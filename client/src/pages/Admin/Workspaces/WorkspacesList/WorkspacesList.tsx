import React, {useEffect, useState, FC} from 'react';
import useStyles from './../../../../styles/table';
import {Button, Container} from '@material-ui/core';
import {DataGrid, GridColDef, GridColTypeDef, GridRowId, GridSelectionModelChangeParams} from '@material-ui/data-grid';
import DeletionButton from '../../../../components/Controls/DeletionButton/DeletionButton';
import WorkspaceDialog from './WorkspaceEdit/WorkspaceDialog';
import {MessageType, useMessage} from '../../../../components/Providers/MessageProvider';
import {LocationOption, Workspace, WorkspaceStatus, WorkspaceType} from '../../../../types';
import {WorkspaceService} from '../../../../services';
import {useToasterCatcher} from '../../../../hooks';

const equipmentColumn: GridColTypeDef = {
  valueFormatter: ({value}) => (Array.isArray(value) ? value.join(', ') : '')
};

const columns: GridColDef[] = [
  {field: 'status', headerName: 'Status', flex: 1},
  {field: 'description', headerName: 'Description', flex: 1},
  {field: 'type', headerName: 'Type', flex: 1},
  {field: 'size', headerName: 'Size', type: 'number', flex: 0.5},
  {field: 'equipment', headerName: 'Equipment', flex: 1.5, ...equipmentColumn}
];

const WorkspacesList: FC<{loc: LocationOption}> = ({loc}) => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [showEdit, setEdit] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState([] as Workspace[]);
  const [selection, setSelection] = useState([] as GridRowId[]);
  const {isLoading, setLoading, catchAndTossError} = useToasterCatcher();

  const defaultWorkspace: Workspace = {
    description: 'WS',
    location: loc.id,
    status: WorkspaceStatus.AVAILABLE,
    type: WorkspaceType.DESK,
    size: 1,
    equipment: []
  };
  const [workspace, setWorkspace] = useState<Workspace>(defaultWorkspace);

  useEffect(() => {
    async function fetchWorkspaces() {
      const workspaces = await catchAndTossError(WorkspaceService.list(loc));
      if (workspaces) {
        setWorkspaces(() => workspaces as Workspace[]);
      }
    }

    if (loc.id) {
      fetchWorkspaces();
    } else {
      setLoading(() => false);
      setWorkspaces(() => []);
    }
  }, [loc]);

  const handleSelection = (selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);
  };

  const dialog = {
    edit: () => {
      setWorkspace(() => workspaces.find((ws) => ws.id === selection[0]) as Workspace);
      setEdit(() => 'edit');
    },
    add: () => {
      setWorkspace((workspace) => ({...workspace, description: 'WS_' + workspaces.length}));
      setEdit(() => 'add');
    },
    close: () => setEdit(() => null)
  };

  const handleCreation = async (formData: Workspace) => {
    const requestData: Workspace = {...formData, location: loc.id};
    const addedWorkspace = (await catchAndTossError(WorkspaceService.add(requestData))) as Workspace | undefined;
    if (!addedWorkspace) {
      return;
    }

    dialog.close();
    setWorkspaces((workspaces) => [...workspaces, addedWorkspace]);
    pushMessage({title: `Workspace "${addedWorkspace.description}" is added`, type: MessageType.SUCCESS});
  };

  const handleUpdate = async (formData: Workspace) => {
    const requestData = {...workspace, ...formData};
    const remaining = (await catchAndTossError(WorkspaceService.update(requestData))) as Workspace[] | undefined;
    if (!remaining) {
      return;
    }

    dialog.close();
    setWorkspace(() => requestData);
    setWorkspaces(() => remaining);
    pushMessage({title: `Workspace "${requestData.description}" is updated`, type: MessageType.SUCCESS});
  };

  const handleDeletion = async () => {
    const remaining = (await catchAndTossError(WorkspaceService.remove(loc, selection))) as Workspace[] | undefined;
    if (!remaining) {
      return;
    }

    setWorkspaces(() => remaining);
    setSelection(() => [] as GridRowId[]);
    const title = selection.length > 1 ? 'Workspaces are deleted' : 'Workspace is deleted';
    pushMessage({title, type: MessageType.SUCCESS});
  };

  return (
    <Container className={classes.container}>
      <DataGrid
        rows={workspaces}
        columns={columns}
        pageSize={4}
        rowsPerPageOptions={[4, 10, 20, 50]}
        autoHeight
        checkboxSelection
        loading={isLoading}
        onSelectionModelChange={handleSelection}
        className={classes.table}
      />
      <Container className={classes.controls}>
        {Boolean(loc.id) && (
          <Button variant="contained" color="primary" onClick={dialog.add}>
            Add
          </Button>
        )}
        {selection.length === 1 && (
          <Button variant="contained" color="primary" className={classes.button} onClick={dialog.edit}>
            Edit
          </Button>
        )}
        {selection.length > 0 && <DeletionButton onDelete={handleDeletion} title="Delete" object={selection.length > 1 ? 'workspaces' : 'workspace'} />}
      </Container>
      {showEdit === 'add' && <WorkspaceDialog mode="Add" workspace={workspace} submit={handleCreation} close={dialog.close} />}
      {showEdit === 'edit' && <WorkspaceDialog mode="Edit" workspace={workspace} submit={handleUpdate} close={dialog.close} />}
    </Container>
  );
};

export default WorkspacesList;
