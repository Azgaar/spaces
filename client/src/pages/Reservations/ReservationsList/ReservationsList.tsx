import React, {useEffect, useState} from "react";
import useStyles from "./ReservationsList.style";
import {Button, Container} from "@material-ui/core";
import {DataGrid, GridColDef, GridRowId, GridSelectionModelChangeParams} from "@material-ui/data-grid";
import DeletionButton from "../../../components/Controls/DeletionButton/DeletionButton";
import {MessageType, useMessage} from "../../../components/providers/MessageProvider";
import {LocationOption, Reservation} from "../../../types";
import {ReservationService} from "../../../services";
import {useToasterCatcher, useUser} from "../../../hooks";
import ReservationDialog from "./ReservationDialog/ReservationDialog";
import dayjs from "dayjs";

// const equipmentColumn: GridColTypeDef = {
//   valueFormatter: ({value}) => Array.isArray(value) ? value.join(", ") : ""
// };

const columns: GridColDef[] = [
  {field: "workspace", headerName: "Workspace", width: 160},
  // {field: "status", headerName: "Status", width: 160}, // make virtual based on dates
  {field: "requester", headerName: "Requester", width: 240},
  {field: "from", headerName: "From", type: "dateTime", width: 240},
  {field: "to", headerName: "To", type: "dateTime", width: 240}
];

const ReservationsList = ({loc}: {loc: LocationOption}) => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [showEdit, setEdit] = useState<string | null>(null);
  const {user} = useUser();
  const [reservations, setReservations] = useState([] as Reservation[]);
  const [selection, setSelection] = useState([] as GridRowId[]);
  const {isLoading, setLoading, catchAndTossError} = useToasterCatcher();

  const from = dayjs().add(1, "hour").set("minute", 0);
  const to = from.add(1, "hour");
  const defaultReservation: Reservation = {
    requester: user.email,
    location: loc.id,
    workspace: "",
    from: from.toDate(),
    to: to.toDate()
  };
  const [reservation, setReservation] = useState<Reservation>(defaultReservation);

  useEffect(() => {
    console.log(loc);
    async function fetchReservations() {
      const reservations: Reservation[] = await catchAndTossError(ReservationService.list(loc));
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
      setReservation(() => reservations.find(rs => rs.id === selection[0]) as Reservation);
      setEdit(() => "edit");
    },
    add: () => {
      setReservation(reservation => ({...reservation, location: loc.id}));
      setEdit(() => "add");
    },
    close: () => setEdit(() => null)
  }

  const handleCreation = async (formData: Reservation) => {
    const requestData: Reservation = {...formData};
    console.log(requestData);
    const addedReservation: Reservation = await catchAndTossError(ReservationService.add(requestData));
    if (!addedReservation) return;

    dialog.close();
    setReservations(reservations => [...reservations, addedReservation]);
    pushMessage({title: "Reservation is added", type: MessageType.SUCCESS});
  }

  const handleUpdate = async (formData: Reservation) => {
    const requestData: Reservation = {...reservation, ...formData};
    const remaining: Reservation[] = await catchAndTossError(ReservationService.update(requestData));
    if (!remaining) return;

    dialog.close();
    setReservation(() => requestData);
    setReservations(() => remaining);
    pushMessage({title: "Reservation is updated", type: MessageType.SUCCESS});
  }

  const handleDeletion = async () => {
    const remaining: Reservation[] = await catchAndTossError(ReservationService.remove(loc, selection));
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
        {selection.length > 0 && <DeletionButton onDelete={handleDeletion} title="Delete" object={selection.length > 1 ? "workspaces" : "workspace"} />}
      </Container>
      {showEdit === "add" && <ReservationDialog mode="Add" reservation={reservation} submit={handleCreation} close={dialog.close} />}
      {showEdit === "edit" && <ReservationDialog mode="Edit" reservation={reservation} submit={handleUpdate} close={dialog.close} />}
    </Container>
  );
};

export default ReservationsList;
