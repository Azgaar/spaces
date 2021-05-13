import React, {useEffect, useState, FC} from 'react';
import useStyles from './../../../../styles/table';
import {Container, Button} from '@material-ui/core';
import {DataGrid, GridColDef, GridRowId, GridSelectionModelChangeParams} from '@material-ui/data-grid';
import {MessageType, useMessage} from '../../../../components/Providers/MessageProvider';
import {useToasterCatcher} from '../../../../hooks';
import {RequestService} from '../../../../services';
import {LocationOption, ReservationRes, ServiceRequestStatus, ServiceRes} from '../../../../types';
import {gridColDateDiffFormat, getDiff} from '../../../../utils';
import ConfirmationDialog from '../../../../components/Controls/ConfirmationDialog/ConfirmationDialog';

const getWorkspaceDesc = ({type, description, size}: ReservationRes) => `${description}: ${type} [${size}]`;
const columns: GridColDef[] = [
  {field: 'status', headerName: 'Status', flex: 0.6},
  {field: 'createdAt', headerName: 'Requested', ...gridColDateDiffFormat},
  {field: 'description', headerName: 'Request', flex: 1.4},
  {field: 'reservation', headerName: 'Workspace', flex: 1, valueFormatter: (params) => params.row?.reservation && getWorkspaceDesc(params.row.reservation)},
  {field: 'requester', headerName: 'Requester', flex: 1.2},
  {field: 'from', headerName: 'Deadline', flex: 0.9, valueFormatter: (params) => getDiff(params.row?.reservation?.from)}
];

const RequestList: FC<{status: ServiceRequestStatus; location: LocationOption}> = ({status, location}) => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [requests, setRequests] = useState<ServiceRes[]>([]);
  const [selection, setSelection] = useState<GridRowId[]>([]);
  const [confirmDeletion, setConfirmDeletion] = useState<boolean>(false);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchRequests() {
      const fetchedRequests = (await catchAndTossError(RequestService.list(location, status))) as ServiceRes[] | undefined;
      if (fetchedRequests) {
        setRequests(() => fetchedRequests);
      }
    }
    if (location.id && status) {
      fetchRequests();
    }
  }, [location, status]);

  const handleSelection = (selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);
  };

  const showConfirmDeletion = () => setConfirmDeletion(() => true);
  const hideConfirmDeletion = () => setConfirmDeletion(() => false);
  const handleDeletion = async () => {
    hideConfirmDeletion();
    const deletionResult = await catchAndTossError(RequestService.remove(selection));
    if (!deletionResult) {
      return;
    }

    setSelection(() => [] as GridRowId[]);
    pushMessage({title: 'Service requests are removed', type: MessageType.SUCCESS});

    const fetchedRequests = (await catchAndTossError(RequestService.list(location, status))) as ServiceRes[] | undefined;
    if (fetchedRequests) {
      setRequests(() => fetchedRequests);
    }
  };

  const handleProcessing = async (processToStatus: ServiceRequestStatus) => {
    const processingResult = await catchAndTossError(RequestService.process(selection, processToStatus));
    if (!processingResult) {
      return;
    }

    setSelection(() => [] as GridRowId[]);
    pushMessage({title: `Service requests are moved to ${status} status`, type: MessageType.SUCCESS});

    const fetchedRequests = (await catchAndTossError(RequestService.list(location, status))) as ServiceRes[] | undefined;
    if (fetchedRequests) {
      setRequests(() => fetchedRequests);
    }
  };

  const Controls: FC = () => {
    const {PENDING, FULFILLED, REJECTED} = ServiceRequestStatus;
    const selected = selection.length > 0;

    return (
      <Container className={classes.controls}>
        <Button variant="contained" color="primary" onClick={showConfirmDeletion} disabled={!selected}>
          Delete
        </Button>
        {selected && status !== PENDING && (
          <Button variant="contained" className={classes.yellow} color="primary" onClick={() => handleProcessing(PENDING)}>
            Delay
          </Button>
        )}
        {selected && status !== FULFILLED && (
          <Button variant="contained" className={classes.green} color="primary" onClick={() => handleProcessing(FULFILLED)}>
            Fulfill
          </Button>
        )}
        {selected && status !== REJECTED && (
          <Button variant="contained" className={classes.red} color="primary" onClick={() => handleProcessing(REJECTED)}>
            Reject
          </Button>
        )}
      </Container>
    );
  };

  return (
    <Container className={classes.container}>
      <DataGrid
        rows={requests}
        columns={columns}
        pageSize={8}
        rowsPerPageOptions={[8, 16, 32, 64, 128]}
        autoHeight
        checkboxSelection
        loading={isLoading}
        onSelectionModelChange={handleSelection}
        className={classes.table}
      />
      <Controls />
      <ConfirmationDialog open={confirmDeletion} onConfirm={handleDeletion} onClose={hideConfirmDeletion} />
    </Container>
  );
};

export default RequestList;
