import React, {FC} from 'react';
import useStyles from './LocationLayoutDialog.style';
import {TextField, Button, Grid, Container, Dialog} from '@material-ui/core';
import Headline from '../../../../../components/Layout/components/Main/Headline/Headline';
import {LocationLayout, LocationOption} from '../../../../../types';

const LocationLayoutDialog: FC<{location: LocationOption; onClose: () => void}> = ({location, onClose}) => {
  const classes = useStyles();
  const layout: LocationLayout = location.layout || {
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

  const handleSubmit = function () {
    //
  };

  return (
    <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
      <Container maxWidth="xs" className={classes.paper}>
        <Headline pagename="Edit Layout" />

        <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField variant="outlined" required fullWidth id="width" label="Width" name="width" autoFocus defaultValue={layout.width} />
            </Grid>
            <Grid item xs={6}>
              <TextField variant="outlined" required fullWidth id="height" label="Height" name="height" autoFocus defaultValue={layout.height} />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} className={classes.buttons}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                Save
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttons}>
              <Button fullWidth variant="contained" color="primary" onClick={onClose}>
                Close
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Dialog>
  );
};

export default LocationLayoutDialog;
