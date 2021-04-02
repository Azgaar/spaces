import React from "react";
import {Container} from "@material-ui/core";
import UsersToolbar from "./UsersToolbar/UsersToolbar";
import UsersList from "./UsersList/UsersList";

function User() {
  const users = [
    {
      id: "0",
      email: "test@user1.com",
      firstName: "Test1",
      lastName: "User1",
      role: "user"
    },
    {
      id: "1",
      email: "test@user2.com",
      firstName: "Test2",
      lastName: "User2",
      role: "user"
    },
    {
      id: "2",
      email: "test@user3.com",
      firstName: "Test3",
      lastName: "User3",
      role: "user"
    },
    {
      id: "3",
      email: "test@user4.com",
      firstName: "Test4",
      lastName: "User4",
      role: "user"
    },
    {
      id: "4",
      email: "test@user5.com",
      firstName: "Test5",
      lastName: "User5",
      role: "user"
    }
  ];

  return (
    <Container maxWidth="lg">
      <UsersToolbar />
      <UsersList users={users} />
    </Container>
  );
}

export default User;
