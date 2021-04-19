import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {GridColTypeDef} from "@material-ui/data-grid";

export const dateFormat: GridColTypeDef = {
  type: "dateTime",
  width: 180,
  valueFormatter: ({value}) => dayjs(value as Date).format("MMM D, YYYY h:mm A")
};

dayjs.extend(relativeTime);
export const getDate = (from: string, to: string) => {
  const now = dayjs();
  const start = dayjs(from).format("ddd, MMMM D");
  const end = dayjs(to).format("ddd, MMMM D");
  const date = start === end ? start : `${dayjs(from).format("MMMM D")} — ${dayjs(to).format("MMMM D")}`;
  const inDays = now.to(dayjs(from > now.toISOString() ? from : to));
  return `${inDays} | ${date}`;
}

export const getTime = (from: string, to: string) => {
  const startA = dayjs(from).format("A");
  const endA = dayjs(to).format("A");
  const start = dayjs(from).format(startA === endA ? "h:mm" : "h:mm A");
  const end = dayjs(to).format("h:mm A");
  return `${start} — ${end}`;
}
