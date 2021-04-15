import React, {useEffect, useState} from "react";
import useStyles from "./ReservationsList.style";
import {Button, Container} from "@material-ui/core";
import {DataGrid, GridColDef, GridColTypeDef, GridRowId, GridSelectionModelChangeParams} from "@material-ui/data-grid";
import DeletionButton from "../../../components/Controls/DeletionButton/DeletionButton";
import {MessageType, useMessage} from "../../../components/providers/MessageProvider";
import {LocationOption, ReservationReq, ReservationRes} from "../../../types";
import {ReservationService} from "../../../services";
import {useToasterCatcher, useUser} from "../../../hooks";
import ReservationDialog from "./ReservationDialog/ReservationDialog";
import dayjs from "dayjs";

const dateFormat: GridColTypeDef = {
  type: "dateTime",
  width: 180,
  valueFormatter: ({value}) => dayjs(value as Date).format("MMM D, YYYY h:mm A")
};
const columns: GridColDef[] = [
  {field: "status", headerName: "Status", width: 120},
  {field: "description", headerName: "Workspace", width: 140},
  {field: "type", headerName: "Type", width: 140},
  {field: "size", headerName: "Size", width: 90},
  {field: "requester", headerName: "Requester", width: 220},
  {field: "from", headerName: "From", ...dateFormat},
  {field: "to", headerName: "To", ...dateFormat}
];

const ReservationsList = ({loc}: {loc: LocationOption}) => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [showEdit, setEdit] = useState<string | null>(null);
  const {user} = useUser();
  const [reservations, setReservations] = useState([] as ReservationRes[]);
  const [selection, setSelection] = useState([] as GridRowId[]);
  const {isLoading, setLoading, catchAndTossError} = useToasterCatcher();

  const from = dayjs().set("minute", 0).set("second", 0).set("millisecond", 0).add(1, "hour");
  const to = from.add(1, "hour");
  const defaultReservation: ReservationReq = {
    requester: user.email,
    location: loc.id,
    workspace: "",
    from: from.toISOString(),
    to: to.toISOString()
  };
  const [reservation, setReservation] = useState<ReservationReq>(defaultReservation);

  useEffect(() => {
    async function fetchReservations() {
      const reservations: ReservationRes[] = await catchAndTossError(ReservationService.list(loc));
      if (reservations) setReservations(() => reservations);
    };

    if (loc.id) {
      fetchReservations();
    } else {
      setLoading(() => false);
      setReservations(() => []);
    }
  }, [loc]);

  const handleSelection = ((selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);
  });

  const dialog = {
    edit: () => {
      const selected: ReservationRes | undefined = reservations.find(rs => rs.id === selection[0]);
      if (!selected) return;
      const {id, location, workspace, requester, from, to} = selected;
      setReservation(() => ({id, location, workspace, requester, from, to}) as ReservationReq);
      setEdit(() => "edit");
    },
    add: () => {
      setReservation(() => defaultReservation);
      setEdit(() => "add");
    },
    close: () => setEdit(() => null)
  }

  const handleCreation = async (formData: ReservationReq) => {
    const requestData: ReservationReq = {...formData, location: loc.id};
    const addedReservation: ReservationRes = await catchAndTossError(ReservationService.add(requestData));
    if (!addedReservation) return;

    dialog.close();
    setReservations(reservations => [...reservations, addedReservation]);
    pushMessage({title: "Reservation is added", type: MessageType.SUCCESS});
  }

  const handleUpdate = async (formData: ReservationReq) => {
    const requestData: ReservationReq = {id: reservation.id, ...formData, location: loc.id};
    const remaining: ReservationRes[] = await catchAndTossError(ReservationService.update(requestData));
    if (!remaining) return;

    dialog.close();
    setReservation(() => requestData);
    setReservations(() => remaining);
    pushMessage({title: "Reservation is updated", type: MessageType.SUCCESS});
  }

  const handleDeletion = async () => {
    const remaining: ReservationRes[] = await catchAndTossError(ReservationService.remove(loc, selection));
    if (!remaining) return;

    setReservations(() => remaining);
    setSelection(() => [] as GridRowId[]);
    const title = selection.length > 1 ? "Reservations are deleted" : "Reservation is deleted";
    pushMessage({title, type: MessageType.SUCCESS});
  }

  return (
    <Container className={classes.container}>
      <DataGrid rows={reservations} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20, 40]}
        autoHeight checkboxSelection loading={isLoading} onSelectionModelChange={handleSelection} />
      <Container className={classes.controls}>
        {Boolean(loc.id) && <Button variant="contained" color="primary" onClick={dialog.add}>Add</Button>}
        {selection.length === 1 && <Button variant="contained" color="primary" className={classes.button} onClick={dialog.edit}>Edit</Button>}
        {selection.length > 0 && <DeletionButton onDelete={handleDeletion} title="Delete" object={selection.length > 1 ? "reservations" : "reservation"} />}
      </Container>
      {showEdit === "add" && <ReservationDialog mode="Add" reservation={reservation} submit={handleCreation} close={dialog.close} />}
      {showEdit === "edit" && <ReservationDialog mode="Edit" reservation={reservation} submit={handleUpdate} close={dialog.close} />}
    </Container>
  );
};

export default ReservationsList;
