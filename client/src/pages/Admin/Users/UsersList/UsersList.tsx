import React, {useEffect, useState} from "react";
import useStyles from "./UsersList.style";
import {Container} from "@material-ui/core";
import DeletionButton from "../../../../components/Controls/DeletionButton/DeletionButton";
import {DataGrid, GridColDef, GridRowId, GridSelectionModelChangeParams} from "@material-ui/data-grid";
import {MessageType, useMessage} from "../../../../components/Providers/MessageProvider";
import {useToasterCatcher} from "../../../../hooks";
import {UserService} from "../../../../services";
import {UserData} from "../../../../types";
import {gridColDateFormat, gridColDateDiffFormat} from "../../../../utils";

const columns: GridColDef[] = [
  {field: "firstName", headerName: "First name", flex: .7},
  {field: "lastName", headerName: "Last name", flex: .8},
  {field: "email", headerName: "Email", flex: 1.4},
  {field: "createdAt", headerName: "Created at", ...gridColDateFormat},
  {field: "updatedAt", headerName: "Last updated", ...gridColDateDiffFormat}
];

const UsersList = () => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [users, setUsers] = useState<UserData[]>([]);
  const [selection, setSelection] = useState<GridRowId[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchUsers() {
      const allUsers: UserData[] = await catchAndTossError(UserService.list());
      if (allUsers) setUsers(() => allUsers);
    };
    fetchUsers();
  }, []);

  const handleSelection = ((selectionModel: GridSelectionModelChangeParams) => {
    const selection = selectionModel.selectionModel;
    setSelection(() => selection);
  });

  const handleDeletion = async () => {
    const remainingUsers: UserData[] = await catchAndTossError(UserService.remove(selection));
    if (!remainingUsers) return;
    setUsers(() => remainingUsers);
    setSelection(() => [] as GridRowId[]);
    const title = selection.length > 1 ? `Users "${selection.join(", ")}" are removed` : `User "${selection[0]}" is removed`;
    pushMessage({title, type: MessageType.SUCCESS});
  }

  return (
    <Container className={classes.container}>
      <DataGrid rows={users} columns={columns} pageSize={6} rowsPerPageOptions={[6, 12, 24, 48]}
        getRowId={(row) => row.email} autoHeight checkboxSelection loading={isLoading} onSelectionModelChange={handleSelection} />
      <Container className={classes.controls}>
        {Boolean(selection.length) && <DeletionButton onDelete={handleDeletion} object={selection.length > 1 ? "users" : "user"} />}
      </Container>
    </Container>
  );
};

export default UsersList;
