import {makeStyles} from '@material-ui/core/styles';
import {green, red, blueGrey} from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  scheme: {
    strokeWidth: 0.08,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  },
  grid: {
    fill: '#fff',
    stroke: '#000',
    strokeWidth: 0.005
  },
  walls: {
    fill: 'none',
    stroke: '#555'
  },
  space: {
    fill: 'url(#grid)'
  },
  obstacles: {
    fill: '#999',
    stroke: '#555'
  },
  entrances: {
    stroke: '#163',
    strokeWidth: 0.3
  },
  fireExits: {
    stroke: '#cc2222',
    strokeWidth: 0.2
  },
  workspaces: {
    stroke: 'none',
    fill: '#bbb',
    cursor: 'pointer',
    '& circle': {
      stroke: '#fff',
      strokeWidth: 0.1
    },
    '& :hover': {
      '& *': {
        fill: theme.palette.primary.main
      }
    }
  },
  available: {
    fill: green[500]
  },
  unavailable: {
    fill: blueGrey[500]
  },
  reserved: {
    fill: red[500]
  }
}));

export default useStyles;
