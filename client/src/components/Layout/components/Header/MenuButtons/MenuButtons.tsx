import React from 'react';
import {MenuItem} from '@material-ui/core';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {AuthService} from '../../../../../services';
import {actions} from '../../../../../store/actions';
import {useToasterCatcher, useUser} from '../../../../../hooks';

const UnauthorizedUserNavButtons = () => {
  return (
    <>
      <MenuItem color="inherit" component={RouterLink} to="/signin">
        Sign In
      </MenuItem>
      <MenuItem color="inherit" component={RouterLink} to="/signup">
        Sign Up
      </MenuItem>
    </>
  );
};

const AuthorizedUserNavButtons = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {catchAndTossError} = useToasterCatcher();

  const handleLogout = async () => {
    const result = await catchAndTossError(AuthService.logout());
    if (!result) {return;}
    dispatch(actions.logout());
    history.push('/signin');
  };

  return (
    <>
      <MenuItem color="inherit" component={RouterLink} to="/profile">
        Profile
      </MenuItem>
      <MenuItem color="inherit" onClick={handleLogout}>
        Log Out
      </MenuItem>
    </>
  );
};

const AdminNavButtons = () => {
  return (
    <>
      <MenuItem color="inherit" component={RouterLink} to="/admin/reservations">
        Reservations
      </MenuItem>
      <MenuItem color="inherit" component={RouterLink} to="/admin/requests">
        Requests
      </MenuItem>
      <MenuItem color="inherit" component={RouterLink} to="/admin/workspaces">
        Workspaces
      </MenuItem>
      <MenuItem color="inherit" component={RouterLink} to="/admin/users">
        Users
      </MenuItem>
    </>
  );
};

const UserNavButtons = () => {
  return (
    <>
      <MenuItem color="inherit" component={RouterLink} to="/reserve">
        Reserve
      </MenuItem>
      <MenuItem color="inherit" component={RouterLink} to="/reservations">
        Reservations
      </MenuItem>
      <MenuItem color="inherit" component={RouterLink} to="/history">
        History
      </MenuItem>
    </>
  );
};

const MenuButtons = () => {
  const {isAuthenticated, isAdmin} = useUser();
  return (
    <>
      {isAuthenticated && (isAdmin ? <AdminNavButtons /> : <UserNavButtons />)}
      {isAuthenticated ? <AuthorizedUserNavButtons /> : <UnauthorizedUserNavButtons />}
    </>
  );
};

export default MenuButtons;
