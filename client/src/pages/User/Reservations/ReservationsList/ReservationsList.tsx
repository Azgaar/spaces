import React, {useEffect, useState} from "react";
import useStyles from "./ReservationsList.style";
import {Typography, Card, CardContent, Container, CardActions, Grid, CardHeader, Badge, Divider, IconButton, Button, Box} from "@material-ui/core";
import Spinner from "../../../../components/Spinner/Spinner";
import WorkspaceTypeIcon from "../../../../components/Icons/WorkspaceTypeIcon/WorkspaceTypeIcon";
import {MessageType, useMessage} from "../../../../components/Providers/MessageProvider";
import {ReservationReq, ReservationRes, ServiceReq, ServiceRes} from "../../../../types";
import {useToasterCatcher, useUser} from "../../../../hooks";
import {RequestService, ReservationService} from "../../../../services";
import {getDate, getTime} from "../../../../utils";
import PlaceIcon from "@material-ui/icons/Place";
import {MAP_SEARCH_BASE_URL} from "../../../../config";
import {Skeleton} from "@material-ui/lab";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {useHistory} from "react-router-dom";
import ReservationEdit from "../ReservationEdit/ReservationEdit";
import ConfirmationDialog from "../../../../components/Controls/ConfirmationDialog/ConfirmationDialog";
import ServiceRequestList from "./ServiceRequestList/ServiceRequestList";

const ReservationsList = ({active}: {active: boolean}) => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const {user} = useUser();
  const [reservations, setReservations] = useState<ReservationRes[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();
  const history = useHistory();
  const [dialog, setDialog] = useState<Dialog>({action: "none", reservation: reservations[0]});

  useEffect(() => {
    async function fetchUserReservations() {
      const reservations: ReservationRes[] = await catchAndTossError(ReservationService.requestList(user.email, active));
      if (reservations) setReservations(() => reservations);
    };

    fetchUserReservations();
  }, []);

  const closeDialog = () => {
    setDialog(() => ({...dialog, action: "none"}));
  } 

  const handleReservationDeletion = async () => {
    const remaining: ReservationRes[] = await catchAndTossError(ReservationService.requestRemoval(user.email, dialog.reservation.id));
    if (!remaining) return;
    setReservations(() => remaining);

    pushMessage({title: "Reservation is removed", type: MessageType.SUCCESS});
    closeDialog();
  }

  const handleReservationUpdate = async (formData: ReservationReq) => {
    const {id, location} = dialog.reservation;
    const requestData: ReservationReq = {...formData, id, location, requester: user.email};
    await catchAndTossError(ReservationService.update(requestData));

    const reservations: ReservationRes[] = await catchAndTossError(ReservationService.requestList(user.email, active));
    if (reservations) setReservations(() => reservations);

    pushMessage({title: "Reservation is updated", type: MessageType.SUCCESS});
    closeDialog();
  }

  const handleServiceCreation = async (reservation: ReservationRes, description: string) => {
    const {id, location} = reservation;
    const requestData: ServiceReq = {location, reservationId: id, requester: user.email, servicesList: [description]};
    const addedServices: ServiceRes[] = await catchAndTossError(RequestService.add(requestData));
    if (!addedServices) return;

    const reservations: ReservationRes[] = await catchAndTossError(ReservationService.requestList(user.email, active));
    if (reservations) setReservations(() => reservations);

    pushMessage({title: "Service is requested", type: MessageType.SUCCESS});
  }

  const handleServiceDeletion = async (id: string) => {
    const deletedId = await catchAndTossError(RequestService.requestRemoval(id, user.email));
    if (!deletedId) return;

    const reservations: ReservationRes[] = await catchAndTossError(ReservationService.requestList(user.email, active));
    if (reservations) setReservations(() => reservations);

    pushMessage({title: "Service request is removed", type: MessageType.SUCCESS});
  }

  const openMap = (address: string) => {
    const url = MAP_SEARCH_BASE_URL + encodeURI(address);
    window.open(url, "_blank", "location=yes");
  }

  const redirectToReserve = () => {
    history.push("/reserve");
  }

  if (isLoading) return <Spinner />
  return (
    <Container className={classes.container}>
      <Grid container spacing={2}>

        {!reservations.length &&
          <Grid item lg={3} md={4} sm={6} xs={12} >
            <Card variant="outlined">
              <CardHeader className={classes.cardHeader}
                avatar={<PostAddIcon />}
                title="No reservations"
                subheader="Reserve a workspace"
                action={!active && (
                  <IconButton aria-label="reserve" onClick={redirectToReserve}>
                    <AddCircleOutlineIcon fontSize="small" />
                  </IconButton>)}/>
              <Divider variant="middle" />

              <CardContent className={classes.content}>
                <Typography variant="caption">
                  <Skeleton animation={false} height={21} width="50%" />
                </Typography>
                <Typography variant="h6">
                  <Skeleton animation={false} height={30} width="80%" />
                </Typography>
              </CardContent>

              <CardActions>
                {active && <Box mx={1}><Button variant="contained" color="primary" onClick={redirectToReserve}>Reserve</Button></Box>}
              </CardActions>
            </Card>
          </Grid>
        }

        {reservations.map(reservation => {
          const isEditable = active && reservation.from > new Date().toISOString();
          const showServices = reservation.requests.length || isEditable;

          return (
            <Grid key={reservation.id} item lg={3} md={4} sm={6} xs={12} >
              <Card variant="outlined" className={classes.card}>
                <CardHeader className={classes.cardHeader} avatar={
                  <Badge badgeContent={reservation.size > 1 && reservation.size}>
                    <WorkspaceTypeIcon value={reservation.type} />
                  </Badge>}
                  title={`${reservation.type} ${reservation.description}`}
                  subheader={reservation.locationDescription}
                  action={(
                    <IconButton aria-label="locate" onClick={() => openMap(reservation.locationDescription)}>
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

                  {showServices && <ServiceRequestList requests={reservation.requests} editable={isEditable}
                    handleDelete={handleServiceDeletion} handleCreate={(description) => handleServiceCreation(reservation, description)} />}
                </CardContent>

                <CardActions>
                  {isEditable && <Button color="primary" onClick={() => setDialog(() => ({action: "edit", reservation}))}>Edit</Button>}
                  {active && <Button color="primary" onClick={() => setDialog(() => ({action: "cancel", reservation}))}>Cancel</Button>}
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {dialog.action === "edit" && <ReservationEdit reservation={dialog.reservation} submit={handleReservationUpdate} close={closeDialog} />}
      <ConfirmationDialog open={dialog.action === "cancel"} onConfirm={handleReservationDeletion} onClose={closeDialog} />
    </Container>
  );
};

type Dialog = {
  action: "none" | "edit" | "cancel";
  reservation: ReservationRes;
}

export default ReservationsList;
