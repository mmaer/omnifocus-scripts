import { dateFromString, formatMinutesToHours } from '../../lib';

const action = new PlugIn.Action(() => {
  const rangeStart = dateFromString('today');
  const rangeEnd = dateFromString('tomorrow');

  const todayTasks = flattenedTasks.filter(({ effectiveDueDate, taskStatus, flagged }) => (
    taskStatus !== Task.Status.Completed && ((effectiveDueDate > rangeStart && effectiveDueDate < rangeEnd) || flagged === true)
  ));

  const { todayActiveTime, flaggedTime, todayUnavailableTime } = todayTasks.reduce(
    ({ todayActiveTime, flaggedTime, todayUnavailableTime }, { estimatedMinutes, flagged, taskStatus }) => ({
      todayActiveTime: todayActiveTime + (!flagged && taskStatus === Task.Status.DueSoon ? estimatedMinutes : 0),
      todayUnavailableTime: todayUnavailableTime + (!flagged && taskStatus !== Task.Status.DueSoon ? estimatedMinutes : 0),
      flaggedTime: flaggedTime + (flagged ? estimatedMinutes : 0)
    }),
    { todayActiveTime: 0, flaggedTime: 0, todayUnavailableTime: 0 }
  );

  const message = `
    Available: ${formatMinutesToHours(todayActiveTime, 'withZeros')}
    Remaining: ${formatMinutesToHours(todayUnavailableTime, 'withZeros')}
    Tagged: ${formatMinutesToHours(flaggedTime, 'withZeros')}
  `;

  const totalTime = todayActiveTime + todayUnavailableTime;

  const alert = new Alert(`Time left today: ${formatMinutesToHours(totalTime, 'withZeros')}`, message);
  alert.show(null);
});

action.validate = () => true;
