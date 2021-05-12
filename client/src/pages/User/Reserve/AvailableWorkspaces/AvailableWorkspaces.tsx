import React, {useEffect, useState, FC} from 'react';
import useStyles from './AvailableWorkspaces.style';
import {Badge, Card, CardActionArea, CardHeader, Grid, LinearProgress} from '@material-ui/core';
import {useToasterCatcher} from '../../../../hooks';
import {WorkspaceService} from '../../../../services';
import {ReservationFilters, Workspace, WorkspaceSearchCriteria} from '../../../../types';
import WorkspaceTypeIcon from '../../../../components/Icons/WorkspaceTypeIcon/WorkspaceTypeIcon';
import SearchIcon from '@material-ui/icons/Search';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

type AvailableWorkspacesProps = {
  filters: ReservationFilters;
  valid: boolean;
  updateToggle: boolean;
  selectedWS: string;
  selectWorkspace: (workspaceId: string) => void;
};

const AvailableWorkspaces: FC<AvailableWorkspacesProps> = ({filters, valid, updateToggle, selectedWS, selectWorkspace}) => {
  const classes = useStyles();
  const {isLoading, setLoading, catchAndTossError} = useToasterCatcher();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [lastSelectedWS, setLastSelectedWS] = useState<string>(selectedWS);

  useEffect(() => {
    async function fetchWorkspaces() {
      const location = filters.location.id;
      const type = filters.type === 'Any' ? undefined : filters.type;
      const criteria: WorkspaceSearchCriteria = {...filters, location, type};

      const freeWorkspaces = (await catchAndTossError(WorkspaceService.find(criteria))) as Workspace[] | undefined;
      setWorkspaces(() => freeWorkspaces || []);
    }

    valid ? fetchWorkspaces() : setLoading(() => false);
  }, [filters, updateToggle]);

  useEffect(() => {
    if (selectedWS) {
      const availableSelectedElement = workspaces.find((ws) => ws.id === selectedWS);
      if (!availableSelectedElement) {
        selectWorkspace('');
      }
    } else if (lastSelectedWS) {
      const availableLastSelectedElement = workspaces.find((ws) => ws.id === lastSelectedWS);
      if (availableLastSelectedElement) {
        selectWorkspace(lastSelectedWS);
      }
    }
  }, [workspaces]);

  const handleSelect = (workspaceId: string): void => {
    if (workspaceId) {
      setLastSelectedWS(() => workspaceId);
    }
    selectWorkspace(workspaceId);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <LinearProgress className={`${classes.progress} ${isLoading ? '' : classes.inactive}`} />

      {!valid && (
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Card className={classes.card} variant="outlined">
            <CardHeader className={classes.cardHeader} avatar={<ErrorOutlineIcon />} title="Validation error" subheader="Fix the error in red" />
          </Card>
        </Grid>
      )}

      {valid && !workspaces.length && (
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Card className={classes.card} variant="outlined">
            <CardHeader className={classes.cardHeader} avatar={<SearchIcon />} title="No workspaces" subheader="Alter search criteria" />
          </Card>
        </Grid>
      )}

      {valid &&
        workspaces.map((workspace) => (
          <Grid key={workspace.id} item md={3} sm={4} xs={12}>
            <Card className={workspace.id === selectedWS ? classes.selectedCard : classes.card} variant="outlined">
              <CardActionArea onClick={() => handleSelect(workspace.id as string)}>
                <CardHeader
                  className={classes.cardHeader}
                  avatar={
                    <Badge badgeContent={workspace.size > 1 && workspace.size}>
                      <WorkspaceTypeIcon value={workspace.type} />
                    </Badge>
                  }
                  title={workspace.description}
                  subheader={workspace.type}
                />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};

export default AvailableWorkspaces;
