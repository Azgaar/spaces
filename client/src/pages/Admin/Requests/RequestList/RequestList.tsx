import React, {useEffect, useState} from "react";
import useStyles from "./RequestList.style";
import {Container} from "@material-ui/core";
import DeletionButton from "../../../../components/Controls/DeletionButton/DeletionButton";
import {DataGrid, GridColDef, GridRowId, GridSelectionModelChangeParams} from "@material-ui/data-grid";
import {MessageType, useMessage} from "../../../../components/Providers/MessageProvider";
import {useToasterCatcher} from "../../../../hooks";
import {RequestService} from "../../../../services";
import {ServiceRequestStatus, ServiceRes} from "../../../../types";
import {gridColLastUpdateFormat} from "../../../../utils";

const columns: GridColDef[] = [
  {field: "status", headerName: "Status", flex: .6},
  {field: "description", headerName: "Request", flex: 1.4},
  {field: "workspace", headerName: "Workspace", flex: .8},
  {field: "requester", headerName: "Requester", flex: 1.2},
  {field: "updatedAt", headerName: "Updated", ...gridColLastUpdateFormat}
];

const RequestList = ({status}: {status: ServiceRequestStatus}) => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [requests, setRequests] = useState<ServiceRes[]>([]);
  const [selection, setSelection] = useState<GridRowId[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchRequests() {
      const fetchedRequests: ServiceRes[] = await catchAndTossError(RequestService.list(status));
      if (fetchedRequests) setRequests(() => fetchedRequests);
    };
    fetchRequests();
  }, [status]);

  const handleSelection = ((selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);
  });

  const handleDeletion = async () => {
    const deletionResult = await catchAndTossError(RequestService.remove(selection));
    if (!deletionResult) return;

    setSelection(() => [] as GridRowId[]);
    pushMessage({title: "Service requests are removed", type: MessageType.SUCCESS});

    const fetchedRequests: ServiceRes[] = await catchAndTossError(RequestService.list(status));
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
