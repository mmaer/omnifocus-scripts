import { dateFromString, formatMinutesToHours, getRangeOfDatesBetween, addDays } from '../../lib';

const OPTIONS = {
  morningStartTime: '00:00',
  morningEndTime: '10:30',
  afternoonStartTime: '10:30',
  afternoonEndTime: '18:00',
  eveningStartTime: '18:00',
  eveningEndTime: '23:00',
  totalTimeToEstimate: 240,
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
  day: { morningTime: number, afternoonTime: number, eveningTime: number },
  morningRange: (day: Date, dueDate: Formatter.Date) => boolean,
  afternoonRange: (day: Date, dueDate: Formatter.Date) => boolean,
  eveningRange: (day: Date, dueDate: Formatter.Date) => boolean,
) => {
  return {
    morningTime: morningRange(dayDate, dueDate) ? day.morningTime + estimatedMinutes : day.morningTime,
    afternoonTime: afternoonRange(dayDate, dueDate) ? day.afternoonTime + estimatedMinutes : day.afternoonTime,
    eveningTime: eveningRange(dayDate, dueDate) ? day.eveningTime + estimatedMinutes : day.eveningTime
  };
};

const options = ['This week', 'Next week'];

const predefinedDatesOptions = {
  [options[0]]: {
    startDate: dateFromString('this monday'),
    endDate: dateFromString('next sunday'),
  },
  [options[1]]: {
    startDate: dateFromString('next monday'),
    endDate: dateFromString('next sunday +7d'),
  }
};

const action = new PlugIn.Action(async () => {
  const { morningStartTime, morningEndTime, afternoonStartTime, afternoonEndTime, eveningStartTime, eveningEndTime, totalTimeToEstimate } = OPTIONS;
  const fmtr = Formatter.Date.withStyle(Formatter.Date.Style.Short, null);
  const inputForm = new Form();
  const startDateField = new Form.Field.Date('startDate', 'Start date', null, fmtr);
  const endDateField = new Form.Field.Date('endDate', 'End date', null, fmtr);
  const predefinedDatesField = new Form.Field.Option('predefinedDates', 'Predefined dates', [0, 1], options, 0, null);

  inputForm.addField(predefinedDatesField, null);
  inputForm.addField(startDateField, null);
  inputForm.addField(endDateField, null);

  const { values: { startDate, endDate, predefinedDates } } = await inputForm.show('Select date range', 'Ok');

  let startDateRange;
  let endDateRange;

  if (startDate !== undefined && endDate !== undefined) {
    startDateRange = startDate;
    endDateRange = endDate;
  } else {
    startDateRange = predefinedDatesOptions[options[predefinedDates]].startDate;
    endDateRange = predefinedDatesOptions[options[predefinedDates]].endDate; 
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
      eveningTime: 0
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

  const estimatedTimeDesc = Object.keys(days).map(day => {
    const morningTime = formatMinutesToHours(days[day].morningTime, 'withZeros');
    const afternoonTime = formatMinutesToHours(days[day].afternoonTime, 'withZeros');
    const eveningTime = formatMinutesToHours(days[day].eveningTime, 'withZeros');

    return `${new Date(day).toLocaleDateString().slice(0, -5)}: ${morningTime} - ${afternoonTime} - ${eveningTime}`;
  });

  const leftTimeDesc = Object.keys(days).map(day => {
    const morningLeftTime = totalTimeToEstimate - days[day].morningTime;
    const afternoonLeftTime = totalTimeToEstimate - days[day].afternoonTime;
    const eveningLeftTime = totalTimeToEstimate - days[day].eveningTime;

    const morningTime = morningLeftTime > 0 ? formatMinutesToHours(morningLeftTime, 'withZeros') : '';
    const afternoonTime = afternoonLeftTime > 0 ? formatMinutesToHours(afternoonLeftTime, 'withZeros') : '';
    const eveningTime = eveningLeftTime > 0 ? formatMinutesToHours(eveningLeftTime, 'withZeros') : '';

    if (!morningTime && !afternoonTime && !eveningTime) {
      return '';
    }

    return `${new Date(day).toLocaleDateString().slice(0, -5)}: ${morningTime}${afternoonTime === '' ? '' : ` - ${afternoonTime}`}${eveningTime === '' ? '' : ` - ${eveningTime}`}`;
  });

  const desc = `${estimatedTimeDesc.join('\n')}\n\nLeft time:\n${leftTimeDesc.join('\n')}`;

  const alert = new Alert('Estimated days:', desc);
  alert.show(null);
});

action.validate = () => true;
