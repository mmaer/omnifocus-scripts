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

export const createDateComponent = ({ month, day, hour, minute }: { month?: number, day?: number, hour?: number, minute?: number }) => {
  const dc = new DateComponents();
  if (month) dc.month = month;
  if (day) dc.day = day;
  if (hour) dc.hour = hour;
  if (minute) dc.minute = minute;
  return dc;
};

export const shiftDateBy = (date: Date | Formatter.Date | null, shiftDate: { month?: number, day?: number, hour?: number, minute?: number }) => {
  if (date === null) return;
  return cal.dateByAddingDateComponents(date as unknown as Date, createDateComponent(shiftDate));
};

export const setIconInLoadingState = (sender: ToolbarItem) => {
  sender.label = 'Loading...';
  sender.toolTip = 'Loading...';
  sender.image = Image.symbolNamed('arrow.circlepath');
};

export const changeIcon = (sender: ToolbarItem, label: string, iconName: string) => {
  sender.label = label;
  sender.toolTip = label;
  sender.image = Image.symbolNamed(iconName);
};

export const isSunday = (day: string) =>  new Date(day).getDay() === 0;
