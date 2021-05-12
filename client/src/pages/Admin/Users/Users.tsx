import React, {FC} from 'react';
import UsersList from './UsersList/UsersList';
import Content from '../../../components/Layout/components/Main/Content';

const User: FC = () => {
  return (
    <Content maxWidth="lg" marginTop={5} pagename="Manage Users">
      <UsersList />
    </Content>
  );
};

export default User;
