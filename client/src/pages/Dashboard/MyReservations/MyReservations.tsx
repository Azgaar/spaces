import React, {useEffect, useState} from "react";
import useStyles from "./MyReservations.style";
import {Typography, Card, CardContent, Container, CardActions, Button, Grid, Icon, CardHeader, Badge, Divider} from "@material-ui/core";
import {MessageType, useMessage} from "../../../components/providers/MessageProvider";
import {ReservationRes, WorkspaceType} from "../../../types";
import {useToasterCatcher, useUser} from "../../../hooks";
import {ReservationService} from "../../../services";
import Spinner from "../../../components/Spinner/Spinner";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import AirlineSeatFlatIcon from "@material-ui/icons/AirlineSeatFlat";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import RouterIcon from "@material-ui/icons/Router";
import WbIncandescentIcon from "@material-ui/icons/WbIncandescent";
import RoomIcon from "@material-ui/icons/Room";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
const getDate = (from: string, to: string) => {
  const now = dayjs();
  const start = dayjs(from).format("ddd, MMMM D");
  const end = dayjs(to).format("ddd, MMMM D");
  const date = start === end ? start : `${dayjs(from).format("MMMM D")} — ${dayjs(to).format("MMMM D")}`;
  const inDays = now.to(dayjs(from > now.toISOString() ? from : to));
  return `${inDays} | ${date}`;
}

const getTime = (from: string, to: string) => {
  const startA = dayjs(from).format("A");
  const endA = dayjs(to).format("A");
  const start = dayjs(from).format(startA === endA ? "h:mm" : "h:mm A");
  const end = dayjs(to).format("h:mm A");
  return `${start} — ${end}`;
}

const getTypeIcon = (type: WorkspaceType): React.ReactElement => {
  switch (type) {
    case WorkspaceType.DESK: return <DesktopWindowsIcon />;
    case WorkspaceType.MEETING_ROOM: return <WbIncandescentIcon />;
    case WorkspaceType.CONFERENCE_ROOM: return <RouterIcon />;
    case WorkspaceType.COWORKING: return <GroupWorkIcon />;
    case WorkspaceType.FOCUS_ROOM: return <VolumeOffIcon />;
    case WorkspaceType.FUN_ZONE: return <SportsEsportsIcon />;
    case WorkspaceType.NAP_POD: return <AirlineSeatFlatIcon />;
    default: return <RoomIcon />;
  }
}

const ReservationsList = () => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const {user} = useUser();
  const [reservations, setReservations] = useState<ReservationRes[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchMyReservations() {
      const reservations: ReservationRes[] = await catchAndTossError(ReservationService.requestList(user.email));
      if (reservations) setReservations(() => reservations);
      console.log(reservations);
    };

    fetchMyReservations();
  }, []);

  // const handleDeletion = async () => {
  //   const remaining: ReservationRes[] = await catchAndTossError(ReservationService.requestRemoval(user.email, selection));
  //   if (!remaining) return;
  //   setReservations(() => remaining);
  //   pushMessage({title: "Reservation is removed", type: MessageType.SUCCESS});
  // }

  if (isLoading) return <Spinner />
  return (
    <Container className={classes.container}>
      <Grid container spacing={2} alignItems="center">
        {reservations.map(reservation => (
          <Grid key={reservation.id} item xs={3}>
            <Card variant="outlined">
              <CardHeader avatar={
                <Badge badgeContent={reservation.size > 1 && reservation.size}>
                  {getTypeIcon(reservation.type)}
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
                <Button size="small" color="primary">Cancel</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ReservationsList;
