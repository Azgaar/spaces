import React from "react";
import useStyles from "./Workspaces.style";
import {Avatar, Container, Typography} from "@material-ui/core";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import WorkspacesList from "./WorkspacesList/WorkspacesList";

function Workspaces() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Avatar className={classes.avatar}>
        <DesktopWindowsIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={classes.header}>Manage Workspaces</Typography>
      <WorkspacesList />
    </Container>
  );
}

export default Workspaces;
