import React, {useEffect, useState, FC} from 'react';
import useStyles from './../../../../styles/table';
import {Button, Container} from '@material-ui/core';
import DeletionButton from '../../../../components/Controls/DeletionButton/DeletionButton';
import {DataGrid, GridColDef, GridSelectionModelChangeParams} from '@material-ui/data-grid';
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
  const [selection, setSelection] = useState<string[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchUsers() {
      const allUsers = await catchAndTossError(UserService.getUsers());
      if (allUsers) {
        setUsers(() => allUsers as UserData[]);
      }
    }
    fetchUsers();
  }, []);

  const handleSelection = (gridSelection: GridSelectionModelChangeParams) => {
    const selection = gridSelection.selectionModel as string[];
    setSelection(() => selection);
  };

  const handleDeletion = async () => {
    const requests = selection.map((userId) => catchAndTossError(UserService.deleteUser(userId)));
    const results = await Promise.all(requests);
    const deletedUsers = results.filter((res) => res !== undefined) as UserData[];

    if (deletedUsers.length) {
      const deletedIds = deletedUsers.map((user) => user.id);
      setUsers((users) => users.filter((user) => !deletedIds.includes(user.id)));
      setSelection(() => []);

      if (deletedIds.length === selection.length) {
        const title = deletedIds.length > 1 ? `Users are removed` : `User is removed`;
        pushMessage({title, type: MessageType.SUCCESS});
      }
    }
  };

  // TODO
  const handleRoleChange = async (email: string, role: UserRole) => {
    const user = (await catchAndTossError(UserService.updateUser(selection[0], {role}))) as UserData | undefined;
    if (user) {
      setUsers((users) => {
        const updatedUser = users.find((oldUser) => oldUser.id === user.id);
        if (updatedUser) {
          updatedUser.role = role;
        }
        return users;
      });

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
          <Button key={role} variant="contained" color="primary" onClick={() => handleRoleChange(email, role as UserRole)}>
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
