import React, {useEffect, useState} from "react";
import useStyles from "./ReservationsList.style";
import {Typography, Card, CardContent, Container, CardActions, Grid, CardHeader, Badge, Divider, IconButton} from "@material-ui/core";
import Spinner from "../../../../components/Spinner/Spinner";
import WorkspaceTypeIcon from "../../../../components/Icons/WorkspaceTypeIcon/WorkspaceTypeIcon";
import {MessageType, useMessage} from "../../../../components/Providers/MessageProvider";
import {ReservationRes} from "../../../../types";
import {useToasterCatcher, useUser} from "../../../../hooks";
import {ReservationService} from "../../../../services";
import {getDate, getTime} from "../../../../utils";
import PlaceIcon from "@material-ui/icons/Place";
import DeletionButton from "../../../../components/Controls/DeletionButton/DeletionButton";

const ReservationsList = ({active}: {active: boolean}) => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const {user} = useUser();
  const [reservations, setReservations] = useState<ReservationRes[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchUserReservations() {
      const reservations: ReservationRes[] = await catchAndTossError(ReservationService.requestList(user.email, active));
      if (reservations) setReservations(() => reservations);
    };

    fetchUserReservations();
  }, []);

  const handleDeletion = async (id: string) => {
    const remaining: ReservationRes[] = await catchAndTossError(ReservationService.requestRemoval(user.email, id));
    if (!remaining) return;
    setReservations(() => remaining);
    pushMessage({title: "Reservation is removed", type: MessageType.SUCCESS});
  }

  const openMap = async (address: string) => {
    const url = `https://www.google.com/maps/search/${address}`;
    window.open(url, "_blank", "location=yes");
  }

  if (isLoading) return <Spinner />
  return (
    <Container className={classes.container}>
      <Grid container spacing={2} alignItems="center">
        {reservations.map(reservation => (
          <Grid key={reservation.id} item lg={3} md={4} sm={6} xs={12} >
            <Card variant="outlined">
              <CardHeader className={classes.cardHeader} avatar={
                <Badge badgeContent={reservation.size > 1 && reservation.size}>
                  <WorkspaceTypeIcon value={reservation.type} />
                </Badge>}
                title={`${reservation.type} ${reservation.description}`}
                subheader={reservation.location}
                action={(
                  <IconButton aria-label="locate" onClick={() => openMap(reservation.location)}>
                    <PlaceIcon fontSize="small" />
                  </IconButton>)}/>
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
                {active && <DeletionButton onDelete={() => handleDeletion(reservation.id)} title="Cancel" cancel="Back" confirm="Confirm" showText={false} />}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ReservationsList;
