import React, {FC, useState} from 'react';
import {Box, Button, Grid} from '@material-ui/core';
import {LocationLayout, LocationOption, Workspace} from '../../../../../types';
import LocationScheme from '../../../../../components/Layout/components/Main/LocationScheme/LocationScheme';
import LayoutEditor from './LayoutEditor/LayoutEditor';
import {useToasterCatcher} from '../../../../../hooks';
import {MessageType, useMessage} from '../../../../../components/Providers/MessageProvider';
import {LocationService} from '../../../../../services';

type WorkspacesSchemeProps = {
  workspaces: Workspace[];
  location: LocationOption;
  onAdd: () => void;
};
const WorkspacesScheme: FC<WorkspacesSchemeProps> = ({workspaces, location, onAdd}) => {
  const {catchAndTossError} = useToasterCatcher();
  const {pushMessage} = useMessage();
  const defaultLayout: LocationLayout = {
    space: [
      [0, 0],
      [25, 0],
      [25, 15],
      [0, 15]
    ],
    walls: [],
    obstacles: [],
    entrances: [],
    fireExits: []
  };
  const [layout, setLayout] = useState<LocationLayout>(location.layout || defaultLayout);

  const saveLayoutChanges = async () => {
    const updatedLocation = (await catchAndTossError(LocationService.update({...location, layout}))) as LocationOption | undefined;
    if (updatedLocation) {
      pushMessage({title: `Layout is saved`, type: MessageType.SUCCESS});
    }
  };

  return (
    <Box p={2}>
      <Grid container spacing={1}>
        <Grid item lg={4} xs={12}>
          <LayoutEditor layout={layout} onChange={(newLayout: LocationLayout) => setLayout(() => newLayout)} />
          <Button variant="contained" color="primary" onClick={saveLayoutChanges}>
            Save changes
          </Button>
          <Button variant="contained" color="primary" onClick={onAdd}>
            Add workspace
          </Button>
        </Grid>
        <Grid item lg={8} xs={12}>
          <LocationScheme layout={layout} workspaces={workspaces} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default WorkspacesScheme;
