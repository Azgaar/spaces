import React, {useEffect, useState} from "react";
import useStyles from "./RequestList.style";
import {Container} from "@material-ui/core";
import DeletionButton from "../../../../components/Controls/DeletionButton/DeletionButton";
import {DataGrid, GridColDef, GridRowId, GridSelectionModelChangeParams} from "@material-ui/data-grid";
import {MessageType, useMessage} from "../../../../components/Providers/MessageProvider";
import {useToasterCatcher} from "../../../../hooks";
import {RequestService} from "../../../../services";
import {UserData} from "../../../../types";
import {gridColDateFormat, gridColLastUpdateFormat} from "../../../../utils";

const columns: GridColDef[] = [
  {field: "status", headerName: "Status", flex: .6},
  {field: "description", headerName: "Request", flex: 1.4},
  {field: "requester", headerName: "Requester", flex: 1.2},
  {field: "createdAt", headerName: "Created at", ...gridColDateFormat},
  {field: "updatedAt", headerName: "Last updated", ...gridColLastUpdateFormat}
];

const RequestList = () => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [requests, setRequests] = useState<UserData[]>([]);
  const [selection, setSelection] = useState<GridRowId[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchRequests() {
      const allRequests: UserData[] = await catchAndTossError(RequestService.list());
      if (allRequests) setRequests(() => allRequests);
    };
    fetchRequests();
  }, []);

  const handleSelection = ((selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);
  });

  const handleDeletion = async () => {
    pushMessage({title: "Service requests are removed", type: MessageType.SUCCESS});
  }

  return (
    <Container className={classes.container}>
      <DataGrid rows={requests} columns={columns} pageSize={10} rowsPerPageOptions={[10, 20, 50]}
        autoHeight checkboxSelection loading={isLoading} onSelectionModelChange={handleSelection} density="compact" />
      <Container className={classes.controls}>
        {Boolean(selection.length) && <DeletionButton onDelete={handleDeletion} object={selection.length > 1 ? "users" : "user"} />}
      </Container>
    </Container>
  );
};

export default RequestList;
