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

  const collapsed = {layout: false, walls: false, obstacles: false};
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
    </List>
  );
};

export default LayoutEditor;
