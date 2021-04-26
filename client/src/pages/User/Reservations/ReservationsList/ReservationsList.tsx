import React, {useEffect, useState} from "react";
import useStyles from "./ReservationsList.style";
import {Typography, Card, CardContent, Container, CardActions, Grid, CardHeader, Badge, Divider, IconButton, Button, Box} from "@material-ui/core";
import Spinner from "../../../../components/Spinner/Spinner";
import WorkspaceTypeIcon from "../../../../components/Icons/WorkspaceTypeIcon/WorkspaceTypeIcon";
import {MessageType, useMessage} from "../../../../components/Providers/MessageProvider";
import {ReservationReq, ReservationRes, ReservationStatus} from "../../../../types";
import {useToasterCatcher, useUser} from "../../../../hooks";
import {ReservationService} from "../../../../services";
import {getDate, getTime} from "../../../../utils";
import PlaceIcon from "@material-ui/icons/Place";
import DeletionButton from "../../../../components/Controls/DeletionButton/DeletionButton";
import {MAP_SEARCH_BASE_URL} from "../../../../config";
import {Skeleton} from "@material-ui/lab";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {useHistory} from "react-router-dom";
import ReservationEdit from "../ReservationEdit/ReservationEdit";

const ReservationsList = ({active}: {active: boolean}) => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const {user} = useUser();
  const [reservations, setReservations] = useState<ReservationRes[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();
  const history = useHistory();
  const [editReservation, setEditReservation] = useState<ReservationReq | null>(null);

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

  const handleEdit = (reservation: ReservationReq) => {
    console.log(reservation);
    setEditReservation(() => reservation);
  }

  const handleEditClose = () => {
    setEditReservation(() => null);
  }

  const handleUpdate = async (formData: ReservationReq) => {
    console.log({formData});
    const requester = user.email;
    const {id, location} = editReservation as ReservationReq;
    const requestData: ReservationReq = {...formData, id, location, requester};
    await catchAndTossError(ReservationService.update(requestData));

    const reservations: ReservationRes[] = await catchAndTossError(ReservationService.requestList(user.email, active));
    if (reservations) setReservations(() => reservations);

    handleEditClose();
    pushMessage({title: "Reservation is updated", type: MessageType.SUCCESS});
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
      <Grid container spacing={2} alignItems="center">

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

        {reservations.map(reservation => (
          <Grid key={reservation.id} item lg={3} md={4} sm={6} xs={12} >
            <Card variant="outlined">
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
              </CardContent>

              <CardActions>
                {active && <Box mx={1}>
                  {reservation.status === ReservationStatus.FUTURE && <Button variant="contained" color="primary" onClick={() => handleEdit(reservation)}>Edit</Button>}
                  <DeletionButton onDelete={() => handleDeletion(reservation.id)} title="Cancel" cancel="Back" confirm="Confirm" showText={false} />
                </Box>}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {editReservation && <ReservationEdit reservation={editReservation} submit={handleUpdate} close={handleEditClose} />}
    </Container>
  );
};

export default ReservationsList;
