import React, {FC} from 'react';
import {LocationLayout, LocationOption, Workspace} from '../../../../../types';
import useStyles from './LocationScheme.style';

const coordsToPath = (array: number[][]): string => 'M' + array.join(' L');

type SchemeProps = {
  location: LocationOption;
  workspaces: Workspace[];
};
const LocationScheme: FC<SchemeProps> = ({location, workspaces}) => {
  const classes = useStyles();

  const layout: LocationLayout = location.layout || {
    width: 25,
    height: 15,
    space: [
      [0, 0],
      [25, 0],
      [25, 15],
      [5, 15],
      [5, 14],
      [0, 14]
    ],
    walls: [
      [
        [10, 0],
        [10, 7]
      ],
      [
        [10, 10],
        [14, 10]
      ],
      [
        [15, 10],
        [22, 10]
      ],
      [
        [23, 10],
        [25, 10]
      ],
      [
        [20, 0],
        [20, 10]
      ]
    ],
    obstacles: [
      [
        [7, 7],
        [10, 7],
        [10, 10],
        [7, 10],
        [7, 7]
      ],
      [
        [17, 5],
        [18, 5],
        [18, 7],
        [17, 7],
        [17, 5]
      ]
    ],
    entrances: [
      [
        [25, 12.1],
        [25, 12.9]
      ]
    ],
    fireExits: [
      [
        [11.15, 0],
        [11.85, 0]
      ],
      [
        [1.15, 14],
        [1.85, 14]
      ]
    ]
  };
  const {width, height, space, walls, obstacles, entrances, fireExits} = layout;
  const viewBox = `-${width * 0.1} -${height * 0.1} ${width * 1.2} ${height * 1.2}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={classes.scheme}>
      <defs>
        <pattern id="grid" width="1" height="1" patternUnits="userSpaceOnUse" className={classes.grid}>
          <path d="M 0 0 V 1 H 1 V -1" />
        </pattern>
      </defs>
      <g>
        <g className={classes.walls}>
          <path d={coordsToPath(space) + 'Z'} className={classes.space} />
          {walls.map((wall) => {
            const path = coordsToPath(wall);
            return <path key={path} d={path} />;
          })}
        </g>
        <g className={classes.obstacles}>
          {obstacles.map((obstacle) => {
            const path = coordsToPath(obstacle);
            return <path key={path} d={path} />;
          })}
        </g>
        <g className={classes.entrances}>
          {entrances.map((entrance) => {
            const path = coordsToPath(entrance);
            return <path key={path} d={path} />;
          })}
        </g>
        <g className={classes.fireExits}>
          {fireExits.map((fireExit) => {
            const path = coordsToPath(fireExit);
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
