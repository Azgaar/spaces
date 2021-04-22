import React, {useEffect, useState} from "react";
import useStyles from "./AvailableWorkspaces.style";
import {Badge, Card, CardHeader, Grid} from "@material-ui/core";
import Spinner from "../../../../components/Spinner/Spinner";
import {useToasterCatcher} from "../../../../hooks";
import {WorkspaceService} from "../../../../services";
import {ReservationForm, ReservationFormErrors, Workspace, WorkspaceSearchCriteria} from "../../../../types";
import WorkspaceTypeIcon from "../../../../components/Icons/WorkspaceTypeIcon/WorkspaceTypeIcon";
import SearchIcon from "@material-ui/icons/Search";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

const AvailableWorkspaces = ({formData, formErrors}: {formData: ReservationForm, formErrors: ReservationFormErrors}) => {
  const classes = useStyles();
  const {isLoading, setLoading, catchAndTossError} = useToasterCatcher();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const {workspace, ...filterErrors} = formErrors;
  const errored = Object.values(filterErrors).some(value => value);

  useEffect(() => {
    async function fetchWorkspaces() {
      const {location, from, to, size, equipment, description} = formData;
      const criteria: WorkspaceSearchCriteria = {location: location.id, from, to, size, equipment, description};
      if (formData.type !== "Any") criteria.type = formData.type;
      console.log({criteria});

      const freeWorkspaces: Workspace[] = await catchAndTossError(WorkspaceService.find(criteria));
      if (freeWorkspaces) setWorkspaces(() => freeWorkspaces);
    };

    errored ? setLoading(() => false) : fetchWorkspaces();
  }, [formErrors]);

  if (isLoading) return <Spinner />
  return (
    <Grid container spacing={2} alignItems="center">
      {errored &&
        <Grid item lg={3} md={4} sm={6} xs={12} >
          <Card variant="outlined">
            <CardHeader className={classes.cardHeader}
              avatar={<ErrorOutlineIcon />}
              title="Validation error"
              subheader="Fix the error in red"/>
          </Card>
        </Grid>
      }

      {!errored && !workspaces.length &&
        <Grid item lg={3} md={4} sm={6} xs={12} >
          <Card variant="outlined">
            <CardHeader className={classes.cardHeader}
              avatar={<SearchIcon />}
              title="No workspaces"
              subheader="Alter search criteria"/>
          </Card>
        </Grid>
      }

      {!errored && workspaces.map(workspace => (
        <Grid key={workspace.id} item lg={2} md={3} sm={4} xs={6} >
          <Card variant="outlined">
            <CardHeader className={classes.cardHeader} avatar={
              <Badge badgeContent={workspace.size > 1 && workspace.size}>
                <WorkspaceTypeIcon value={workspace.type} />
              </Badge>}
              title={workspace.description}
              subheader={workspace.type} />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AvailableWorkspaces;
