import React from "react";
import {Box, Button, Card, CardContent, TextField} from "@material-ui/core";

const UsersToolbar = (props: {}) => (
  <Box {...props}>
    <Card>
      <CardContent>
        <TextField fullWidth placeholder="Search" variant="outlined" />
        <Button>Import</Button>
        <Button>Export</Button>
        <Button>Add customer</Button>
      </CardContent>
    </Card>
  </Box>
);

export default UsersToolbar;
