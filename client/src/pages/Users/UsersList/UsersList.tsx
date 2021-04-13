import React, {useEffect, useState} from "react";
import useStyles from "./UsersList.style";
import {Container} from "@material-ui/core";
import DeletionButton from "../../../components/Controls/DeletionButton/DeletionButton";
import {DataGrid, GridColDef, GridColTypeDef, GridRowId, GridSelectionModelChangeParams} from "@material-ui/data-grid";
import {MessageType, useMessage} from "../../../components/providers/MessageProvider";
import {useToasterCatcher} from "../../../hooks";
import {UserService} from "../../../services";
import {UserData} from "../../../types";
import dayjs from "dayjs";

const dateFormat: GridColTypeDef = {
  type: "dateTime",
  width: 200,
  valueFormatter: ({value}) => dayjs(value as Date).format("MMM D, YYYY h:mm A")
};

const columns: GridColDef[] = [
  {field: "role", headerName: "Role", width: 90},
  {field: "firstName", headerName: "First name", width: 140},
  {field: "lastName", headerName: "Last name", width: 140},
  {field: "email", headerName: "Email", width: 280},
  {field: "createdAt", headerName: "Created at", ...dateFormat},
  {field: "updatedAt", headerName: "Updated at", ...dateFormat}
];

const UsersList = () => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [users, setUsers] = useState([] as UserData[]);
  const [selection, setSelection] = useState([] as GridRowId[]);
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
