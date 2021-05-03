import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {GridColTypeDef} from '@material-ui/data-grid';
dayjs.extend(relativeTime);
const DATE_FORMAT = 'ddd, MMMM D';
const DATETIME_FORMAT = 'MMM D, YYYY h:mm A';

export const gridColDateFormat: GridColTypeDef = {
  type: 'dateTime',
  flex: 1,
  valueFormatter: ({value}) => dayjs(value as Date).format(DATETIME_FORMAT)
};

export const gridColDateDiffFormat: GridColTypeDef = {
  type: 'string',
  flex: 0.9,
  valueFormatter: ({value}) => getDiff(value as string)
};

export const getDate = (from: string, to: string) => {
  const start = dayjs(from).format(DATE_FORMAT);
  const end = dayjs(to).format(DATE_FORMAT);
  const date = start === end ? start : `${dayjs(from).format('MMMM D')} — ${dayjs(to).format('MMMM D')}`;
  const readable = getHumanReadDiff(from, to);
  return `${readable} | ${date}`;
};

export const getTime = (from: string, to: string) => {
  const startA = dayjs(from).format('A');
  const endA = dayjs(to).format('A');
  const start = dayjs(from).format(startA === endA ? 'h:mm' : 'h:mm A');
  const end = dayjs(to).format('h:mm A');
  return `${start} — ${end}`;
};

export const getDiff = (date: string) => dayjs().to(dayjs(date));

const getHumanReadDiff = (from: string, to: string) => {
  const now = dayjs().toISOString();
  if (from > now) {return 'Begins ' + getDiff(from);}
  if (from < now && to > now) {return 'Ends ' + getDiff(to);}
  else {return getDiff(to);}
};

export const getMaxDate = () => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const yearEnd = '12-31-' + (month > 10 ? year + 1 : year);
  return yearEnd;
};
