import React, {useEffect, useState} from "react";
import useStyles from "./ReservationsList.style";
import {Typography, Card, CardContent, Container, CardActions, Button, Grid, CardHeader, Badge, Divider} from "@material-ui/core";
import Spinner from "../../../../components/Spinner/Spinner";
import WorkspaceTypeIcon from "../../../../components/Icons/WorkspaceTypeIcon/WorkspaceTypeIcon";
import {MessageType, useMessage} from "../../../../components/Providers/MessageProvider";
import {ReservationRes} from "../../../../types";
import {useToasterCatcher, useUser} from "../../../../hooks";
import {ReservationService} from "../../../../services";
import {getDate, getTime} from "../../../../utils";

const ReservationsList = () => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const {user} = useUser();
  const [reservations, setReservations] = useState<ReservationRes[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchMyReservations() {
      const reservations: ReservationRes[] = await catchAndTossError(ReservationService.requestActive(user.email));
      if (reservations) setReservations(() => reservations);
    };

    fetchMyReservations();
  }, []);

  const handleDeletion = async (id: string) => {
    const remaining: ReservationRes[] = await catchAndTossError(ReservationService.requestRemoval(user.email, id));
    if (!remaining) return;
    setReservations(() => remaining);
    pushMessage({title: "Reservation is removed", type: MessageType.SUCCESS});
  }

  if (isLoading) return <Spinner />
  return (
    <Container className={classes.container}>
      <Grid container spacing={2} alignItems="center">
        {reservations.map(reservation => (
          <Grid key={reservation.id} item xs={3}>
            <Card variant="outlined">
              <CardHeader avatar={
                <Badge badgeContent={reservation.size > 1 && reservation.size}>
                  <WorkspaceTypeIcon type={reservation.type} />
                </Badge>}
              title={`${reservation.type} ${reservation.description}`}
              subheader="Minsk, Tolstogo 10, 3th floor"/>
              <Divider variant="middle" />

              <CardContent className={classes.content}>
                <Typography variant="caption">
                  {getDate(reservation.from, reservation.to)}
                </Typography>
                <Typography variant="h6">
                  {getTime(reservation.from, reservation.to)}
                </Typography>
              </CardContent>

              <CardActions>
                <Button size="small" color="primary" onClick={() => handleDeletion(reservation.id)}>Cancel</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ReservationsList;
