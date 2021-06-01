import React, {FC, useState} from 'react';
import useStyles from './WorkspaceScheme.style';
import {Box, Button, Grid} from '@material-ui/core';
import {LocationLayout, LocationOption, Workspace} from '../../../../../types';
import LocationScheme from '../../../../../components/Layout/components/Main/LocationScheme/LocationScheme';
import PointsList from './WorkspaceSchemeEdit/PointsList';

type WorkspacesSchemeProps = {
  workspaces: Workspace[];
  location: LocationOption;
  onAdd: () => void;
};
const WorkspacesScheme: FC<WorkspacesSchemeProps> = ({workspaces, location, onAdd}) => {
  const classes = useStyles();
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

  // const layout = {
  //   width: 25,
  //   height: 15,
  //   space: [
  //     [0, 0],
  //     [25, 0],
  //     [25, 15],
  //     [5, 15],
  //     [5, 14],
  //     [0, 14]
  //   ],
  //   walls: [
  //     [
  //       [10, 0],
  //       [10, 7]
  //     ],
  //     [
  //       [10, 10],
  //       [14, 10]
  //     ],
  //     [
  //       [15, 10],
  //       [22, 10]
  //     ],
  //     [
  //       [23, 10],
  //       [25, 10]
  //     ],
  //     [
  //       [20, 0],
  //       [20, 10]
  //     ]
  //   ],
  //   obstacles: [
  //     [
  //       [7, 7],
  //       [10, 7],
  //       [10, 10],
  //       [7, 10],
  //       [7, 7]
  //     ],
  //     [
  //       [17, 5],
  //       [18, 5],
  //       [18, 7],
  //       [17, 7],
  //       [17, 5]
  //     ]
  //   ],
  //   entrances: [
  //     [
  //       [25, 12.1],
  //       [25, 12.9]
  //     ]
  //   ],
  //   fireExits: [
  //     [
  //       [11.15, 0],
  //       [11.85, 0]
  //     ],
  //     [
  //       [1.15, 14],
  //       [1.85, 14]
  //     ]
  //   ]
  // };

  return (
    <Box p={2}>
      <Grid container spacing={1}>
        <Grid item lg={3} xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">
                Edit layout
              </Button>

              <PointsList points={layout.space} onChange={(newPoints: number[][]) => setLayout((layout) => ({...layout, space: newPoints}))} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={onAdd}>
                Add workspace
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={9} xs={12}>
          <LocationScheme layout={layout} workspaces={workspaces} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default WorkspacesScheme;
