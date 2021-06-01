import React, {FC} from 'react';
import useStyles from './LayoutEditor.style';
import {Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Typography} from '@material-ui/core';
import {LocationLayout} from '../../../../../../types';
import PointsList from './PointsList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';

type LayoutEditorProps = {
  layout: LocationLayout;
  onChange: (newLayout: LocationLayout) => void;
};
const LayoutEditor: FC<LayoutEditorProps> = ({layout, onChange}) => {
  const classes = useStyles();

  return (
    <Box p={0}>
      <Accordion TransitionProps={{unmountOnExit: true}} className={classes.accordion}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Layout</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PointsList points={layout.space} onChange={(newPoints: number[][]) => onChange({...layout, space: newPoints})} />
        </AccordionDetails>
      </Accordion>

      <Accordion TransitionProps={{unmountOnExit: true}} className={classes.accordion}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Walls</Typography>
          <IconButton edge="end" disabled={layout.walls.length > 1000} className={classes.accordionButton}>
            <AddIcon fontSize="small" />
          </IconButton>
        </AccordionSummary>
        <AccordionDetails>
          {layout.walls.map((wall: number[][], i: number) => (
            <Accordion TransitionProps={{unmountOnExit: true}} className={classes.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Wall {i + 1}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PointsList
                  points={wall}
                  onChange={(newPoints: number[][]) => {
                    const newWalls = layout.walls.slice();
                    newWalls[i] = newPoints;
                    onChange({...layout, walls: newWalls});
                  }}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default LayoutEditor;
