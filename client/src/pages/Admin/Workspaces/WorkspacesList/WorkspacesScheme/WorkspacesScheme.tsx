import React, {ChangeEvent, FC, useState} from 'react';
import useStyles from '../../../../../styles/table';
import {Box, Button, Grid, InputLabel, TextField} from '@material-ui/core';
import {LocationLayout, LocationOption, Workspace} from '../../../../../types';
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
  const defaultLayout: LocationLayout = {
    width: 25,
    height: 15,
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

  const changeSpace = (i: number, axis: number, value: number): void => {
    const newSpace = layout.space.slice();
    newSpace[i][axis] = value;
    setLayout((layout) => ({...layout, space: newSpace}));
  };

  return (
    <Box p={2}>
      <Grid container spacing={1}>
        <Grid item lg={3} xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" className={classes.button} onClick={() => setShowEditDialog(() => true)}>
                Edit layout
              </Button>

              <TextField
                type="number"
                required
                fullWidth
                id="width"
                label="Width"
                name="width"
                autoFocus
                InputProps={{inputProps: {min: 1, max: 1024}}}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLayout((layout) => ({...layout, width: parseInt(e.target.value)}))}
                defaultValue={layout.width}
              />
              <TextField
                type="number"
                required
                fullWidth
                id="height"
                label="Height"
                name="height"
                autoFocus
                InputProps={{inputProps: {min: 1, max: 1024}}}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLayout((layout) => ({...layout, height: parseInt(e.target.value)}))}
                defaultValue={layout.height}
              />

              {layout.space.map((coords: number[], i: number) => (
                <div>
                  <InputLabel shrink required>
                    Point {i + 1}
                  </InputLabel>
                  <TextField
                    type="number"
                    id="x"
                    name="x"
                    required
                    InputProps={{inputProps: {min: 0, max: layout.width}}}
                    defaultValue={coords[0]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => changeSpace(i, 0, parseInt(e.target.value))}
                  />
                  <TextField
                    type="number"
                    id="y"
                    name="y"
                    required
                    InputProps={{inputProps: {min: 0, max: layout.height}}}
                    defaultValue={coords[1]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => changeSpace(i, 1, parseInt(e.target.value))}
                  />
                </div>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" className={classes.button} onClick={onAdd}>
                Add workspace
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={9} xs={12}>
          <LocationScheme layout={layout} workspaces={workspaces} />
        </Grid>
      </Grid>
      {showEditDialog && <LocationLayoutDialog location={location} onClose={() => setShowEditDialog(() => false)} />}
    </Box>
  );
};

export default WorkspacesScheme;
