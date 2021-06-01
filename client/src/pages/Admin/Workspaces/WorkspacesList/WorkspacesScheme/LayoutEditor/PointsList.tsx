import React, {FC, ChangeEvent} from 'react';
import useStyles from './PointsList.style';
import {IconButton, InputAdornment, List, ListItem, ListItemSecondaryAction, TextField, Typography, useMediaQuery, useTheme} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';

type PointsListProps = {
  points: number[][];
  onChange: (newPoints: number[][]) => void;
};
const PointsList: FC<PointsListProps> = ({points, onChange}) => {
  const classes = useStyles();
  const smallScreen = useMediaQuery(useTheme().breakpoints.down('xs'));

  const changePoint = (index: number, axis: number, value: number): void => {
    const newPoints = points.slice();
    newPoints[index][axis] = value;
    onChange(newPoints);
  };

  const addPoint = (index: number): void => {
    const thisPoint = points[index];
    const nextPoint = points[index + 1];
    const newPoint = nextPoint ? [Math.round((thisPoint[0] + nextPoint[0]) / 2), thisPoint[1]] : thisPoint.slice();
    const newPoints = points.slice();
    newPoints.splice(index + 1, 0, newPoint);
    onChange(newPoints);
  };

  const deletePoint = (index: number): void => {
    const newPoints = points.slice();
    newPoints.splice(index, 1);
    onChange(newPoints);
  };

  return (
    <List dense disablePadding>
      {points.map((coords: number[], i: number) => (
        <ListItem key={`point${i}of${points.length}`} className={classes.listItem}>
          {!smallScreen && (
            <Typography variant="body1" color="textSecondary">
              Point {i + 1}
            </Typography>
          )}
          <TextField
            type="number"
            id="x"
            name="x"
            required
            InputProps={{inputProps: {min: 0, max: 999, autoComplete: 'off'}, startAdornment: <InputAdornment position="start">x</InputAdornment>}}
            defaultValue={coords[0]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => changePoint(i, 0, parseInt(e.target.value))}
          />
          <TextField
            type="number"
            id="y"
            name="y"
            required
            InputProps={{inputProps: {min: 0, max: 999, autoComplete: 'off'}, startAdornment: <InputAdornment position="start">y</InputAdornment>}}
            defaultValue={coords[1]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => changePoint(i, 1, parseInt(e.target.value))}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => addPoint(i)} disabled={points.length > 1000}>
              <AddIcon fontSize="small" />
            </IconButton>
            <IconButton edge="end" onClick={() => deletePoint(i)} disabled={points.length < 3}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default PointsList;
