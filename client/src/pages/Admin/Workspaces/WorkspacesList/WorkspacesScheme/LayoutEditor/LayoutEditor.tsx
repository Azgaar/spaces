import React, {FC, MouseEventHandler} from 'react';
import useStyles from './LayoutEditor.style';
import {Box, Collapse, IconButton, List, ListItem, ListItemText} from '@material-ui/core';
import {LocationLayout} from '../../../../../../types';
import PointsList from './PointsList';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

type LayoutEditorProps = {
  layout: LocationLayout;
  onChange: (newLayout: LocationLayout) => void;
};
const LayoutEditor: FC<LayoutEditorProps> = ({layout, onChange}) => {
  const classes = useStyles();
  console.log(layout);

  const collapsed = {layout: false, walls: false, obstacles: false, entrances: false, fireExits: false};
  const [open, setOpen] = React.useState(collapsed);

  const addWall: MouseEventHandler = (e) => {
    e.stopPropagation();
    const newWalls = layout.walls.slice();
    const x = Math.ceil(Math.random() * 18);
    const y = Math.ceil(Math.random() * 13);
    const l = Math.ceil(Math.random() * 10);
    const from = Math.random() < 0.5 ? [x, y] : [y, x];
    const to = Math.random() < 0.5 ? [x + l, y] : [y, x + l];
    newWalls.push([from, to]);
    onChange({...layout, walls: newWalls});
  };

  const addObstacle: MouseEventHandler = (e) => {
    e.stopPropagation();
    const newObstacles = layout.obstacles.slice();
    const x = Math.ceil(Math.random() * 15);
    const y = Math.ceil(Math.random() * 10);
    const lx = Math.ceil(Math.random() * 4);
    const ly = Math.ceil(Math.random() * 4);
    newObstacles.push([
      [x, y],
      [x + lx, y],
      [x + lx, y + ly],
      [x, y + ly]
    ]);
    onChange({...layout, obstacles: newObstacles});
  };

  const addEntrance: MouseEventHandler = (e) => {
    e.stopPropagation();
    const newEntrances = layout.entrances.slice();
    const x = Math.ceil(Math.random() * 10);
    const l = Math.ceil(Math.random() * 2);
    newEntrances.push([
      [x, 0],
      [x + l, 0]
    ]);
    onChange({...layout, entrances: newEntrances});
  };

  const addFireExit: MouseEventHandler = (e) => {
    e.stopPropagation();
    const newFireExits = layout.fireExits.slice();
    const x = 10 + Math.ceil(Math.random() * 10);
    newFireExits.push([
      [x, 0],
      [x + 1, 0]
    ]);
    onChange({...layout, fireExits: newFireExits});
  };

  return (
    <List className={classes.root}>
      <ListItem button onClick={() => setOpen(() => ({...collapsed, layout: !open.layout}))}>
        <ListItemText primary="Layout" />
        {open.layout ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open.layout} timeout="auto" unmountOnExit>
        <PointsList points={layout.space} onChange={(newPoints: number[][]) => onChange({...layout, space: newPoints})} />
      </Collapse>

      <ListItem button onClick={() => setOpen(() => ({...collapsed, walls: !open.walls}))}>
        <ListItemText primary="Walls" />
        <IconButton disabled={layout.walls.length > 200} onClick={addWall}>
          <AddIcon />
        </IconButton>
        {open.walls ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open.walls} timeout="auto" unmountOnExit>
        <List>
          {layout.walls.map((wall: number[][], i: number) => (
            <Box key={`wall${i}of${layout.walls.length}`} pl={2}>
              <ListItem>
                <ListItemText primary={`Wall ${i + 1}`} />
                <IconButton
                  edge="end"
                  onClick={() => {
                    const newWalls = layout.walls.slice();
                    newWalls.splice(i, 1);
                    onChange({...layout, walls: newWalls});
                  }}>
                  <ClearIcon />
                </IconButton>
              </ListItem>

              <PointsList
                points={wall}
                onChange={(newPoints: number[][]) => {
                  const newWalls = layout.walls.slice();
                  newWalls[i] = newPoints;
                  onChange({...layout, walls: newWalls});
                }}
              />
            </Box>
          ))}
        </List>
      </Collapse>

      <ListItem button onClick={() => setOpen(() => ({...collapsed, obstacles: !open.obstacles}))}>
        <ListItemText primary="Obstacles" />
        <IconButton disabled={layout.obstacles.length > 50} onClick={addObstacle}>
          <AddIcon />
        </IconButton>
        {open.obstacles ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open.obstacles} timeout="auto" unmountOnExit>
        <List>
          {layout.obstacles.map((obstacle: number[][], i: number) => (
            <Box key={`obstacle${i}of${layout.obstacles.length}`} pl={2}>
              <ListItem>
                <ListItemText primary={`Obstacle ${i + 1}`} />
                <IconButton
                  edge="end"
                  onClick={() => {
                    const newObstacles = layout.obstacles.slice();
                    newObstacles.splice(i, 1);
                    onChange({...layout, obstacles: newObstacles});
                  }}>
                  <ClearIcon />
                </IconButton>
              </ListItem>

              <PointsList
                points={obstacle}
                onChange={(newPoints: number[][]) => {
                  const newObstacles = layout.obstacles.slice();
                  newObstacles[i] = newPoints;
                  onChange({...layout, obstacles: newObstacles});
                }}
              />
            </Box>
          ))}
        </List>
      </Collapse>

      <ListItem button onClick={() => setOpen(() => ({...collapsed, entrances: !open.entrances}))}>
        <ListItemText primary="Entrances" />
        <IconButton disabled={layout.entrances.length > 20} onClick={addEntrance}>
          <AddIcon />
        </IconButton>
        {open.entrances ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open.entrances} timeout="auto" unmountOnExit>
        <List>
          {layout.entrances.map((entrance: number[][], i: number) => (
            <Box key={`entrance${i}of${layout.entrances.length}`} pl={2}>
              <ListItem>
                <ListItemText primary={`Entrance ${i + 1}`} />
                <IconButton
                  edge="end"
                  onClick={() => {
                    const newEntrances = layout.entrances.slice();
                    newEntrances.splice(i, 1);
                    onChange({...layout, entrances: newEntrances});
                  }}>
                  <ClearIcon />
                </IconButton>
              </ListItem>

              <PointsList
                points={entrance}
                onChange={(newPoints: number[][]) => {
                  const newEntrances = layout.entrances.slice();
                  newEntrances[i] = newPoints;
                  onChange({...layout, entrances: newEntrances});
                }}
              />
            </Box>
          ))}
        </List>
      </Collapse>

      <ListItem button onClick={() => setOpen(() => ({...collapsed, fireExits: !open.fireExits}))}>
        <ListItemText primary="Fire exits" />
        <IconButton disabled={layout.fireExits.length > 20} onClick={addFireExit}>
          <AddIcon />
        </IconButton>
        {open.fireExits ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open.fireExits} timeout="auto" unmountOnExit>
        <List>
          {layout.fireExits.map((fireExit: number[][], i: number) => (
            <Box key={`fireExit${i}of${layout.fireExits.length}`} pl={2}>
              <ListItem>
                <ListItemText primary={`Fire exit ${i + 1}`} />
                <IconButton
                  edge="end"
                  onClick={() => {
                    const newFireExits = layout.fireExits.slice();
                    newFireExits.splice(i, 1);
                    onChange({...layout, fireExits: newFireExits});
                  }}>
                  <ClearIcon />
                </IconButton>
              </ListItem>

              <PointsList
                points={fireExit}
                onChange={(newPoints: number[][]) => {
                  const newFireExits = layout.fireExits.slice();
                  newFireExits[i] = newPoints;
                  onChange({...layout, fireExits: newFireExits});
                }}
              />
            </Box>
          ))}
        </List>
      </Collapse>
    </List>
  );
};

export default LayoutEditor;
