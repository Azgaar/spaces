import React, {FC, useState} from 'react';
import useStyles from '../../../../../styles/table';
import {Button, Container} from '@material-ui/core';
import {LocationOption, Workspace} from '../../../../../types';
import LocationScheme from '../../../../../components/Layout/components/Main/LocationScheme/LocationScheme';
import LocationLayoutDialog from '../LocationLayoutEdit/LocationLayoutDialog';

type WorkspacesSchemeProps = {
  workspaces: Workspace[];
  location: LocationOption;
  onAdd: () => void;
};
const WorkspacesScheme: FC<WorkspacesSchemeProps> = ({workspaces, location, onAdd}) => {
  const classes = useStyles();
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <Container>
      <Container maxWidth="md">
        <LocationScheme location={location} workspaces={workspaces} />
      </Container>
      <Button variant="contained" color="primary" className={classes.button} onClick={() => setShowEditDialog(() => true)}>
        Edit layout
      </Button>
      <Button variant="contained" color="primary" className={classes.button} onClick={onAdd}>
        Add workspace
      </Button>
      {showEditDialog && <LocationLayoutDialog location={location} onClose={() => setShowEditDialog(() => false)} />}
    </Container>
  );
};

export default WorkspacesScheme;
