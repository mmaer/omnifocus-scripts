const action = new PlugIn.Action((selection: Selection) => { 
  const tasks = [...selection.projects, ...selection.tasks];

  if (tasks.length === 1) {
    Pasteboard.general.string = `omnifocus:///task/${tasks[0].id.primaryKey}`;
    return;
  }

  tasks.forEach(task => {
    tasks.forEach(task2 => {
      if (task.id.primaryKey !== task2.id.primaryKey) {
        if (!task2.containingProject) {
          task.note = `${task2.name} omnifocus:///task/${task2.id.primaryKey}\n${task.note}`;
        } else {
          task.note = `${task2.containingProject.name}: ${task2.name} omnifocus:///task/${task2.id.primaryKey}\n${task.note}`;
        }
      }
    });
  });
});

action.validate = function (selection: Selection) {
  return selection.projects.length + selection.tasks.length >= 1;
};