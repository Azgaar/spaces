import React, {useEffect, useState, FC} from 'react';
import useStyles from './../../../../styles/table';
import {Button, Container} from '@material-ui/core';
import DeletionButton from '../../../../components/Controls/DeletionButton/DeletionButton';
import {DataGrid, GridColDef, GridRowId, GridSelectionModelChangeParams} from '@material-ui/data-grid';
import {MessageType, useMessage} from '../../../../components/Providers/MessageProvider';
import {useToasterCatcher} from '../../../../hooks';
import {UserService} from '../../../../services';
import {UserData, UserRole} from '../../../../types';
import {gridColDateFormat, gridColDateDiffFormat, capitalize} from '../../../../utils';

const columns: GridColDef[] = [
  {field: 'role', headerName: 'Role', flex: 0.7, valueFormatter: ({value}) => capitalize(value as string)},
  {field: 'firstName', headerName: 'First name', flex: 0.7},
  {field: 'lastName', headerName: 'Last name', flex: 0.8},
  {field: 'email', headerName: 'Email', flex: 1.4},
  {field: 'createdAt', headerName: 'Created at', ...gridColDateFormat},
  {field: 'updatedAt', headerName: 'Last updated', ...gridColDateDiffFormat}
];

const UsersList: FC = () => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [users, setUsers] = useState<UserData[]>([]);
  const [selection, setSelection] = useState<GridRowId[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchUsers() {
      const allUsers = await catchAndTossError(UserService.list());
      if (allUsers) {
        setUsers(() => allUsers as UserData[]);
      }
    }
    fetchUsers();
  }, []);

  const handleSelection = (selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);
  };

  const handleDeletion = async () => {
    const remainingUsers = (await catchAndTossError(UserService.remove(selection))) as UserData[] | undefined;
    if (remainingUsers) {
      setUsers(() => remainingUsers);
      setSelection(() => [] as GridRowId[]);
      const title = selection.length > 1 ? `Users "${selection.join(', ')}" are removed` : `User "${selection[0]}" is removed`;
      pushMessage({title, type: MessageType.SUCCESS});
    }
  };

  const handleRoleChange = async (email: string, role: UserRole) => {
    const users = (await catchAndTossError(UserService.changeRole(email, role))) as UserData[] | undefined;
    if (users) {
      setUsers(() => users);
      setSelection(() => [] as GridRowId[]);
      pushMessage({title: `Role is changed to ${role}`, type: MessageType.SUCCESS});
    }
  };

  const RoleChangeButton = () => {
    const email = selection[0] as string;
    const userRole = users.find((user) => user.email === email)?.role;
    if (!userRole) {
      return null;
    }

    const roles = Object.values(UserRole).filter((role) => role !== userRole);
    return (
      <>
        {roles.map((role) => (
          <Button variant="contained" color="primary" onClick={() => handleRoleChange(email, role as UserRole)}>
            {console.log(role, userRole)}
            Make {role}
          </Button>
        ))}
      </>
    );
  };

  return (
    <Container className={classes.container}>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20, 50]}
        getRowId={(row) => row.email}
        autoHeight
        checkboxSelection
        loading={isLoading}
        onSelectionModelChange={handleSelection}
        className={classes.table}
      />
      <Container className={classes.controls}>
        <DeletionButton onDelete={handleDeletion} object={selection.length > 1 ? 'users' : 'user'} disabled={selection.length < 1} />
        {selection.length === 1 && <RoleChangeButton />}
      </Container>
    </Container>
  );
};

export default UsersList;
