import React, {useEffect, useState} from "react";
import useStyles from "./MyReservations.style";
import {Container} from "@material-ui/core";
import {DataGrid, GridColDef, GridRowId, GridSelectionModelChangeParams} from "@material-ui/data-grid";
import DeletionButton from "../../../components/Controls/DeletionButton/DeletionButton";
import {MessageType, useMessage} from "../../../components/providers/MessageProvider";
import {ReservationRes} from "../../../types";
import {useToasterCatcher, useUser} from "../../../hooks";
import {dateFormat} from "../../../utils";
import {ReservationService} from "../../../services";

const columns: GridColDef[] = [
  {field: "status", headerName: "Status", width: 120},
  {field: "description", headerName: "Workspace", width: 140},
  {field: "type", headerName: "Type", width: 140},
  {field: "size", headerName: "Size", width: 90},
  {field: "requester", headerName: "Requester", width: 220},
  {field: "from", headerName: "From", ...dateFormat},
  {field: "to", headerName: "To", ...dateFormat}
];

const ReservationsList = () => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const {user} = useUser();
  const [reservations, setReservations] = useState<ReservationRes[]>([]);
  const [selection, setSelection] = useState<GridRowId[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchMyReservations() {
      const reservations: ReservationRes[] = await catchAndTossError(ReservationService.requestList(user.email));
      if (reservations) setReservations(() => reservations);
    };

    fetchMyReservations();
  }, []);

  const handleSelection = ((selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);
  });

  const handleDeletion = async () => {
    const remaining: ReservationRes[] = await catchAndTossError(ReservationService.requestRemoval(user.email, selection));
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
        {selection.length > 0 && <DeletionButton onDelete={handleDeletion} title="Delete" object={selection.length > 1 ? "reservations" : "reservation"} />}
      </Container>
    </Container>
  );
};

export default ReservationsList;
