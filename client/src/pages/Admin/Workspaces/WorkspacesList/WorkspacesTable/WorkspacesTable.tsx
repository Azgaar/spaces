import React, {useState, FC} from 'react';
import useStyles from './../../../../../styles/table';
import {Button, Container} from '@material-ui/core';
import {DataGrid, GridColDef, GridColTypeDef, GridSelectionModelChangeParams} from '@material-ui/data-grid';
import DeletionButton from '../../../../../components/Controls/DeletionButton/DeletionButton';
import {Workspace} from '../../../../../types';

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

type WorkspaceTableProps = {
  workspaces: Workspace[];
  onAdd: () => void;
  onEdit: (workspaceId: string) => void;
  onDelete: (workspaceIds: string[]) => void;
};
const WorkspacesTable: FC<WorkspaceTableProps> = ({workspaces, onAdd, onEdit, onDelete}) => {
  const classes = useStyles();
  const [selection, setSelection] = useState<string[]>([]);

  const handleSelection = (selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel as string[];
    setSelection(() => selection);
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
        onSelectionModelChange={handleSelection}
        className={classes.table}
      />
      <Container className={classes.controls}>
        <Button variant="contained" color="primary" onClick={onAdd}>
          Add
        </Button>
        {selection.length === 1 && (
          <Button variant="contained" color="primary" className={classes.button} onClick={() => onEdit(selection[0])}>
            Edit
          </Button>
        )}
        {selection.length > 0 && <DeletionButton onDelete={() => onDelete(selection)} title="Delete" object={selection.length > 1 ? 'workspaces' : 'workspace'} />}
      </Container>
    </Container>
  );
};

export default WorkspacesTable;
