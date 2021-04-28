import React, {useEffect, useState} from "react";
import useStyles from "./RequestList.style";
import {Container} from "@material-ui/core";
import DeletionButton from "../../../../components/Controls/DeletionButton/DeletionButton";
import {DataGrid, GridColDef, GridRowId, GridSelectionModelChangeParams} from "@material-ui/data-grid";
import {MessageType, useMessage} from "../../../../components/Providers/MessageProvider";
import {useToasterCatcher} from "../../../../hooks";
import {RequestService} from "../../../../services";
import {LocationOption, ReservationRes, ServiceRequestStatus, ServiceRes} from "../../../../types";
import {gridColDateDiffFormat, getDiff} from "../../../../utils";

const getWorkspaceDesc = ({type, description, size}: ReservationRes) => `${description}: ${type} [${size}]`;
const columns: GridColDef[] = [
  {field: "status", headerName: "Status", flex: .6},
  {field: "createdAt", headerName: "Requested", ...gridColDateDiffFormat},
  {field: "description", headerName: "Request", flex: 1.4},
  {field: "reservation", headerName: "Workspace", flex: 1, valueFormatter: (params) => params.row?.reservation && getWorkspaceDesc(params.row.reservation)},
  {field: "requester", headerName: "Requester", flex: 1.2},
  {field: "from", headerName: "Deadline", flex: .9, valueFormatter: (params) => getDiff(params.row?.reservation?.from)}
];

const RequestList = ({status, location}: {status: ServiceRequestStatus, location: LocationOption}) => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [requests, setRequests] = useState<ServiceRes[]>([]);
  const [selection, setSelection] = useState<GridRowId[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchRequests() {
      const fetchedRequests: ServiceRes[] = await catchAndTossError(RequestService.list(location, status));
      if (fetchedRequests) setRequests(() => fetchedRequests);
    };
    if (location.id && status) fetchRequests();
  }, [location, status]);

  const handleSelection = ((selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);
  });

  const handleDeletion = async () => {
    const deletionResult = await catchAndTossError(RequestService.remove(selection));
    if (!deletionResult) return;

    setSelection(() => [] as GridRowId[]);
    pushMessage({title: "Service requests are removed", type: MessageType.SUCCESS});

    const fetchedRequests: ServiceRes[] = await catchAndTossError(RequestService.list(location, status));
    if (fetchedRequests) setRequests(() => fetchedRequests);
  }

  return (
    <Container className={classes.container}>
      <DataGrid rows={requests} columns={columns} pageSize={8} rowsPerPageOptions={[8, 16, 32, 64, 128]}
        autoHeight checkboxSelection loading={isLoading} onSelectionModelChange={handleSelection} density="compact" />
      <Container className={classes.controls}>
        {Boolean(selection.length) && <DeletionButton onDelete={handleDeletion} object={selection.length > 1 ? "requests" : "request"} />}
      </Container>
    </Container>
  );
};

export default RequestList;
