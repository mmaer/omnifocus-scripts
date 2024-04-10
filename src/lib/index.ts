const cal = Calendar.current;

const fmatr = Formatter.Date.withStyle(Formatter.Date.Style.Short, null);

export const copyToClipboard = (string: string): void => {
  Pasteboard.general.string = string;
};

export const getLinkToTask = (primaryKey: string): string => {
  return `omnifocus:///task/${primaryKey}`;
};

export const dateFromString = (date: string) => fmatr.dateFromString(date);

export const stringFromDate = (date: Formatter.Date) => fmatr.stringFromDate(date);

export const dateComponentsFromDate = (date: Date) => cal.dateComponentsFromDate(date);

export const formatMinutesToHours = (totalTime: number, type = 'full') => {
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;

  if (type === 'full') return `${hours === 0 ? '' : `${hours} hours `}${minutes} minutes`;
  if (type === 'withZeros') return `${hours}h ${minutes > 9 ? minutes : `0${minutes}`}m`;

  return `${hours === 0 ? '' : `${hours}h`} ${minutes === 0 ? '' : `${minutes}m`}`;
};

export const addDays = (startDate: Date | string, days: number): Date | null => {
  const date = new Date(startDate);
  return cal.dateByAddingDateComponents(date, createDateComponent({ day: days }));
};

export const getRangeOfDatesBetween = (date1: Date | string, date2: Date | string) => {
  const dateArray = [];
  let currentDate = date1;

  while (currentDate <= date2) {
    dateArray.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  return dateArray;
};

export const createDateComponent = ({ day, hour, minute }: { day?: number, hour?: number, minute?: number }) => {
  const dc = new DateComponents();
  if (day) dc.day = day;
  if (hour) dc.hour = hour;
  if (minute) dc.minute = minute;
  return dc;
};

export const shiftDateBy = (date: Date | null, shiftDate: { day: number, hour: number, minute: number }) => {
  if (date === null) return;
  return cal.dateByAddingDateComponents(date, createDateComponent(shiftDate));
};