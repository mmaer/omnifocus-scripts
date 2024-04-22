import { dateFromString, formatMinutesToHours, getRangeOfDatesBetween, addDays } from '../../lib';
import { settings, getTotalTimeToEstimate } from './settings';

const OPTIONS = {
  morningStartTime: '00:00',
  morningEndTime: '10:30',
  afternoonStartTime: '10:30',
  afternoonEndTime: '18:00',
  eveningStartTime: '18:00',
  eveningEndTime: '23:00',
};

const isInTimeRange = (timeStart: string, timeEnd: string) => (date: Date, dueDate: Formatter.Date) => {
  const startRande = dateFromString(`${date.toLocaleDateString()} ${timeStart}`);
  const endRande = dateFromString(`${date.toLocaleDateString()} ${timeEnd}`);

  if (startRande === null || endRande === null) return false;
  return dueDate >= startRande && dueDate < endRande;
};

const isInDayRange = (day: Date, nextDay: string | Date, dueDate: Date) => {
  if (day === null || nextDay === null) return false;
  return dueDate >= day && dueDate < nextDay;
};

const updateDay = (
  dayDate: Date, 
  dueDate: Formatter.Date, 
  estimatedMinutes: number, 
  day: { morningTime: number, afternoonTime: number, eveningTime: number, totalTime: number },
  morningRange: (day: Date, dueDate: Formatter.Date) => boolean,
  afternoonRange: (day: Date, dueDate: Formatter.Date) => boolean,
  eveningRange: (day: Date, dueDate: Formatter.Date) => boolean,
) => {
  return {
    morningTime: morningRange(dayDate, dueDate) ? day.morningTime + estimatedMinutes : day.morningTime,
    afternoonTime: afternoonRange(dayDate, dueDate) ? day.afternoonTime + estimatedMinutes : day.afternoonTime,
    eveningTime: eveningRange(dayDate, dueDate) ? day.eveningTime + estimatedMinutes : day.eveningTime,
    totalTime: day.totalTime + estimatedMinutes
  };
};

const predefinedDates = {
  ['Next week']: {
    startDate: dateFromString('next monday'),
    endDate: dateFromString('next sunday +7d'),
  },
  ['This week']: {
    startDate: dateFromString('this monday'),
    endDate: dateFromString('next sunday'),
  }
} as { [k: string]: { startDate: Formatter.Date, endDate: Formatter.Date } } ;

const predefinedDatesOptions = Object.keys(predefinedDates);

const action = new PlugIn.Action(async () => {
  if (app.optionKeyDown) {
    await settings();
    return;
  }

  const { morningStartTime, morningEndTime, afternoonStartTime, afternoonEndTime, eveningStartTime, eveningEndTime } = OPTIONS;
  const totalTimeToEstimate = getTotalTimeToEstimate();
  const fmtr = Formatter.Date.withStyle(Formatter.Date.Style.Short, null);
  const inputForm = new Form();
  const startDateField = new Form.Field.Date('startDate', 'Start date', null, fmtr);
  const endDateField = new Form.Field.Date('endDate', 'End date', null, fmtr);

  const predefinedDatesField = new Form.Field.Option('predefinedDatesIndex', 'Predefined dates', [0, 1], predefinedDatesOptions, 0, null);

  inputForm.addField(predefinedDatesField, null);
  inputForm.addField(startDateField, null);
  inputForm.addField(endDateField, null);

  const { values: { startDate, endDate, predefinedDatesIndex } } = await inputForm.show('Select date range', 'Ok');

  let startDateRange;
  let endDateRange;

  if (startDate !== undefined && endDate !== undefined) {
    startDateRange = startDate;
    endDateRange = endDate;
  } else {
    startDateRange = predefinedDates[predefinedDatesOptions[predefinedDatesIndex]].startDate;
    endDateRange = predefinedDates[predefinedDatesOptions[predefinedDatesIndex]].endDate; 
  }

  const taskToCount = flattenedTasks.filter(({ effectiveDueDate, taskStatus, estimatedMinutes }) => {
    if (taskStatus === Task.Status.Completed) return false;
    if (estimatedMinutes === null) return false;
    return effectiveDueDate > startDateRange && effectiveDueDate < addDays(endDateRange, 1);
  });

  const rangeOfDates = getRangeOfDatesBetween(startDateRange, endDateRange).reduce((prev, date) => {
    prev[date.toString()] = {
      morningTime: 0,
      afternoonTime: 0,
      eveningTime: 0,
      totalTime: 0
    };
    return prev;
  }, {} as { [k: string]: unknown });

  const morningRange = isInTimeRange(morningStartTime, morningEndTime);
  const afternoonRange = isInTimeRange(afternoonStartTime, afternoonEndTime);
  const eveningRange = isInTimeRange(eveningStartTime, eveningEndTime);

  const days = taskToCount.reduce((prev, { effectiveDueDate, estimatedMinutes }) => {
    Object.keys(rangeOfDates).forEach((date) => {
      const nextDay = addDays(date, 1);
      const day = new Date(date);
      
      if (isInDayRange(day, nextDay, effectiveDueDate)) {
        prev[date] = updateDay(day, effectiveDueDate, estimatedMinutes, prev[date], morningRange, afternoonRange, eveningRange);
      }
    });
    return prev;
  }, rangeOfDates);

  let totalTime = 0;
  const estimatedTimeDesc = Object.keys(days).map(day => {
    const totalDayTime = formatMinutesToHours(days[day].totalTime, 'withZeros');
    totalTime += days[day].totalTime;

    return `${new Date(day).toLocaleDateString().slice(0, -5)}: ${totalDayTime}`;
  });

  let totalLeftTime = 0;
  const leftTimeDaysDesc = Object.keys(days).map(day => {
    const totalDayLeftTime = totalTimeToEstimate - days[day].totalTime;

    const totalTime = totalDayLeftTime > 0 ? formatMinutesToHours(totalDayLeftTime, 'withZeros') : '';
    totalLeftTime += totalDayLeftTime > 0 ? totalDayLeftTime : 0;
    
    if (!totalTime) return '';

    return `${new Date(day).toLocaleDateString().slice(0, -5)}: ${totalTime}`;
  });

  const totalTimeDesc = `Total time: ${formatMinutesToHours(totalTime, 'withZeros')}`;
  const totalLeftTimeDesc = `Total left time: ${formatMinutesToHours(totalLeftTime, 'withZeros')}`;
  const leftTimeDesc = totalTimeToEstimate ? `Left time to estimate (per day ${formatMinutesToHours(totalTimeToEstimate, 'withZeros')}):${leftTimeDaysDesc.join('\n')}\n${totalLeftTimeDesc}` : '';

  const desc = `${estimatedTimeDesc.join('\n')}\n${totalTimeDesc}\n\n${leftTimeDesc}`;

  const alert = new Alert('Estimated days:', desc);
  alert.show(null);
});

action.validate = () => true;
