import React from "react";
import useStyles from "./Workspaces.style";
import {Avatar, Button, Container, Grid, TextField, Typography} from "@material-ui/core";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import WorkspacesList from "./WorkspacesList/WorkspacesList";
import {Autocomplete} from "@material-ui/lab";

function Workspaces() {
  const classes = useStyles();

  const options = [
    {id: 1, description: "1st floor"},
    {id: 2, description: "2nd floor"},
    {id: 3, description: "3rd floor"},
  ];

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Avatar className={classes.avatar}>
        <DesktopWindowsIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={classes.header}>Manage Workspaces</Typography>

      <Container>
        <Grid container alignItems="center">
          <Grid item xs={3}>
            <Autocomplete id="addresses" options={options} getOptionLabel={(option) => option.description}
                renderInput={(params) => <TextField {...params} label="Address" variant="outlined" />} />
          </Grid>
          <Grid item xs={9}>
            <Button variant="contained" color="primary" className={classes.control}>Add</Button>
            <Button variant="contained" color="primary" className={classes.control}>Rename</Button>
            <Button variant="contained" color="primary" className={classes.control}>Delete</Button>
          </Grid>
        </Grid>
      </Container>
      <WorkspacesList />
    </Container>
  );
}

export default Workspaces;
