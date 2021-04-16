import dayjs from "dayjs";
import {GridColTypeDef} from "@material-ui/data-grid";

export const dateFormat: GridColTypeDef = {
  type: "dateTime",
  width: 180,
  valueFormatter: ({value}) => dayjs(value as Date).format("MMM D, YYYY h:mm A")
};
