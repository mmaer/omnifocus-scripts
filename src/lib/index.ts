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