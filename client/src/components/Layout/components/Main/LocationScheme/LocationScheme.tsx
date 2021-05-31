import React, {FC} from 'react';
import {Workspace} from '../../../../../types';
import useStyles from './LocationScheme.style';

type SchemeProps = {
  scheme: {
    width: number;
    height: number;
    space: number[][];
    walls: number[][][];
    obstacles: number[][][];
    entrances: number[][][];
    fireExits: number[][][];
  };
  workspaces: Workspace[];
};

const arrayToPath = (array: number[][]): string => 'M' + array.join(' L');

const LocationScheme: FC<SchemeProps> = ({scheme, workspaces}) => {
  const classes = useStyles();
  const {width, height, space, walls, obstacles, entrances, fireExits} = scheme;
  const viewBox = `-${width * 0.1} -${height * 0.1} ${width * 1.2} ${height * 1.2}`;
  console.log(workspaces);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={classes.scheme}>
      <defs>
        <pattern id="grid" width="1" height="1" patternUnits="userSpaceOnUse" className={classes.grid}>
          <path d="M 0 0 V 1 H 1 V -1" />
        </pattern>
      </defs>
      <g>
        <g className={classes.walls}>
          <path d={arrayToPath(space) + 'Z'} className={classes.space} />
          {walls.map((wall) => {
            const path = arrayToPath(wall);
            return <path key={path} d={path} />;
          })}
        </g>
        <g className={classes.obstacles}>
          {obstacles.map((obstacle) => {
            const path = arrayToPath(obstacle);
            return <path key={path} d={path} />;
          })}
        </g>
        <g className={classes.entrances}>
          {entrances.map((entrance) => {
            const path = arrayToPath(entrance);
            return <path key={path} d={path} />;
          })}
        </g>
        <g className={classes.fireExits}>
          {fireExits.map((fireExit) => {
            const path = arrayToPath(fireExit);
            return <path key={path} d={path} />;
          })}
        </g>
      </g>
      <g className={classes.workspaces}>
        {workspaces.map((workspace) => {
          const {x, y, angle} = workspace;
          if (x === undefined || y === undefined || angle === undefined) {
            return null;
          }
          const status = workspace.status.toLowerCase() as 'available' | 'unavailable';
          const transform = angle ? `rotate(${angle} ${x + 0.5} ${y + 0.5})` : undefined;
          return (
            <g key={workspace.id}>
              <rect x={x} y={y} width={1} height={1} fill="#fff" opacity={0} />
              <rect x={x + 0.05} y={y + 0.05} width={0.9} height={0.45} rx={0.1} ry={0.1} transform={transform} />
              <circle cx={x + 0.5} cy={y + 0.5} r={0.25} className={classes[status]} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default LocationScheme;
