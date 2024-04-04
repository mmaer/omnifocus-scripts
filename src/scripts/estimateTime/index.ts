import { formatMinutesToHours } from '../../lib';

const action = new PlugIn.Action((selection: Selection) => {
  const tasks = [...selection.projects, ...selection.tasks];
  const { totalTime, noEstimatedTasks } = tasks.reduce(({ noEstimatedTasks, totalTime }, { name, estimatedMinutes }) => ({
    noEstimatedTasks: estimatedMinutes === null ? [...noEstimatedTasks, name] : noEstimatedTasks,
    totalTime: estimatedMinutes === null ? totalTime : totalTime + estimatedMinutes
  }), { totalTime: 0, noEstimatedTasks: [] });

  const formattedTime = formatMinutesToHours(totalTime);
  const tasksNoEstimated = noEstimatedTasks.length > 1 ? `Tasks(${noEstimatedTasks.length}) have no estimate:\n${noEstimatedTasks.join('\n')}` : '';

  const alert = new Alert(`Total time: ${formattedTime}`, tasksNoEstimated);
  alert.show(null);
});

action.validate = (selection: Selection) => selection.projects.length + selection.tasks.length >= 1;
