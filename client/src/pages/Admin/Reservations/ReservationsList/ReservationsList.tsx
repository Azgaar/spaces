import React, {ReactElement, useEffect, useState, FC} from 'react';
import useStyles from './../../../../styles/table';
import {Button, Container} from '@material-ui/core';
import {DataGrid, GridCellValue, GridColDef, GridRowId, GridSelectionModelChangeParams} from '@material-ui/data-grid';
import DeletionButton from '../../../../components/Controls/DeletionButton/DeletionButton';
import {MessageType, useMessage} from '../../../../components/Providers/MessageProvider';
import {LocationOption, ReservationReq, ReservationRes, ServiceRequestStatus} from '../../../../types';
import {ReservationService} from '../../../../services';
import {useToasterCatcher, useUser} from '../../../../hooks';
import ReservationDialog from './ReservationDialog/ReservationDialog';
import dayjs from 'dayjs';
import {gridColDateFormat} from '../../../../utils';
import RequestStatusIcon from '../../../../components/Icons/RequestStatusIcon/RequestStatusIcon';

const countRequests = {
  renderCell: ({value}: {value: GridCellValue}): ReactElement => {
    if (!Array.isArray(value) || value.length === 0) {
      return <>no</>;
    }

    const {PENDING, FULFILLED, REJECTED} = ServiceRequestStatus;
    const pending = value.filter((request) => request.status === PENDING).length;
    const fullfilled = value.filter((request) => request.status === FULFILLED).length;
    const rejected = value.filter((request) => request.status === REJECTED).length;

    const buttonPending = (
      <>
        {pending}
        <RequestStatusIcon value={PENDING} />
      </>
    );
    const buttonFulfilled = (
      <>
        {fullfilled}
        <RequestStatusIcon value={FULFILLED} />
      </>
    );
    const buttonRejected = (
      <>
        {rejected}
        <RequestStatusIcon value={REJECTED} />
      </>
    );

    return (
      <>
        {!!pending && buttonPending}
        {!!fullfilled && buttonFulfilled}
        {!!rejected && buttonRejected}
      </>
    );
  }
};

const columns: GridColDef[] = [
  {field: 'status', headerName: 'Status', flex: 0.6},
  {field: 'description', headerName: 'Workspace', flex: 0.8},
  {field: 'type', headerName: 'Type', flex: 0.6},
  {field: 'requester', headerName: 'Requester', flex: 1.1},
  {field: 'size', headerName: 'Size', flex: 0.5},
  {field: 'requests', headerName: 'Requests', flex: 0.7, ...countRequests},
  {field: 'from', headerName: 'From', ...gridColDateFormat},
  {field: 'to', headerName: 'To', ...gridColDateFormat}
];

const ReservationsList: FC<{loc: LocationOption}> = ({loc}) => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [showEdit, setEdit] = useState<string | null>(null);
  const {user} = useUser();
  const [reservations, setReservations] = useState<ReservationRes[]>([]);
  const [selection, setSelection] = useState<GridRowId[]>([]);
  const {isLoading, setLoading, catchAndTossError} = useToasterCatcher();
  const [isEditable, setEditable] = useState<boolean>(false);

  const from = dayjs().set('minute', 0).set('second', 0).set('millisecond', 0).add(1, 'hour');
  const to = from.add(1, 'hour');
  const defaultReservation: ReservationReq = {
    requester: user.email,
    location: loc.id,
    workspace: '',
    from: from.toISOString(),
    to: to.toISOString()
  };
  const [reservation, setReservation] = useState<ReservationReq>(defaultReservation);

  useEffect(() => {
    async function fetchReservations() {
      const reservations = (await catchAndTossError(ReservationService.list(loc))) as ReservationRes[] | undefined;
      if (reservations) {
        setReservations(() => reservations);
      }
    }

    if (loc.id) {
      fetchReservations();
    } else {
      setLoading(() => false);
      setReservations(() => []);
    }
  }, [loc]);

  const handleSelection = (selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);

    if (selection.length === 1) {
      const selected = reservations.find((rs) => rs.id === selection[0]);
      const currentTime = new Date().toISOString();
      setEditable(() => Boolean(selected && selected.from > currentTime));
    } else {
      setEditable(() => false);
    }
  };

  const dialog = {
    edit: () => {
      const selected: ReservationRes | undefined = reservations.find((rs) => rs.id === selection[0]);
      if (!selected) {
        return;
      }

      const {id, workspace, requester, from, to} = selected;
      setReservation(() => ({id, workspace, requester, from, to, location: loc.id} as ReservationReq));
      setEdit(() => 'edit');
    },
    add: () => {
      setReservation(() => defaultReservation);
      setEdit(() => 'add');
    },
    close: () => setEdit(() => null)
  };

  const handleCreation = async (formData: ReservationReq) => {
    const requestData: ReservationReq = {...formData, location: loc.id};
    const addedReservation = (await catchAndTossError(ReservationService.add(requestData))) as ReservationRes | undefined;
    if (!addedReservation) {
      return;
    }

    dialog.close();
    setReservations((reservations) => [addedReservation, ...reservations]);
    pushMessage({title: 'Workspace is reserved', type: MessageType.SUCCESS});
  };

  const handleUpdate = async (formData: ReservationReq) => {
    const requestData: ReservationReq = {id: reservation.id, ...formData, location: loc.id};
    const remaining = (await catchAndTossError(ReservationService.update(requestData))) as ReservationRes[] | undefined;
    if (!remaining) {
      return;
    }

    dialog.close();
    setReservation(() => requestData);
    setReservations(() => remaining);
    pushMessage({title: 'Reservation is updated', type: MessageType.SUCCESS});
  };

  const handleDeletion = async () => {
    const remaining = (await catchAndTossError(ReservationService.remove(loc, selection))) as ReservationRes[] | undefined;
    if (!remaining) {
      return;
    }

    setReservations(() => remaining);
    setSelection(() => [] as GridRowId[]);
    const title = selection.length > 1 ? 'Reservations are deleted' : 'Reservation is deleted';
    pushMessage({title, type: MessageType.SUCCESS});
  };

  return (
    <Container className={classes.container}>
      <DataGrid
        rows={reservations}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20, 40]}
        autoHeight
        checkboxSelection
        loading={isLoading}
        onSelectionModelChange={handleSelection}
        className={classes.table}
      />
      <Container className={classes.controls}>
        {Boolean(loc.id) && (
          <Button variant="contained" color="primary" onClick={dialog.add}>
            Add
          </Button>
        )}
        {isEditable && (
          <Button variant="contained" color="primary" className={classes.button} onClick={dialog.edit}>
            Edit
          </Button>
        )}
        {selection.length > 0 && <DeletionButton onDelete={handleDeletion} title="Delete" object={selection.length > 1 ? 'reservations' : 'reservation'} />}
      </Container>
      {showEdit === 'add' && <ReservationDialog mode="Add" reservation={reservation} submit={handleCreation} close={dialog.close} />}
      {showEdit === 'edit' && <ReservationDialog mode="Edit" reservation={reservation} submit={handleUpdate} close={dialog.close} />}
    </Container>
  );
};

export default ReservationsList;
