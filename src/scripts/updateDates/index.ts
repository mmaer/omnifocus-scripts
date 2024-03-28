import { dateFromString, dateComponentsFromDate } from "../../lib";

const action = new PlugIn.Action(async ({ projects, tasks }: Selection) => {
  const selectedItems = [...projects, ...tasks];

  const inputForm = new Form();
  const field = new Form.Field.String("dateInput", "Data", null, null);
  const field2 = new Form.Field.String("deferDateTimeInput", "Defer date", null, null);
  const field3 = new Form.Field.String("dueDateTimeInput", "Due date", null, null);

  inputForm.addField(field, null);
  inputForm.addField(field2, null);
  inputForm.addField(field3, null);

  const { values } = await inputForm.show("", "Zaaktualizuj");

  const { dateInput, dueDateTimeInput, deferDateTimeInput } = values;

  selectedItems.forEach(task => {
    const dueDateTask = dateComponentsFromDate(task.dueDate);
    const deferDateTask = dateComponentsFromDate(task.deferDate);

    const dueDate = dueDateTimeInput ? dueDateTimeInput : `${dueDateTask.hour}:${dueDateTask.minute}`;
    const deferDate = deferDateTimeInput ? deferDateTimeInput : `${deferDateTask.hour}:${deferDateTask.minute}`;
    
    task.dueDate = dateFromString(`${dateInput}, ${dueDate}`);
    task.deferDate = dateFromString(`${dateInput}, ${deferDate}`);
  });

});

action.validate = ({ projects, tasks }: Selection) => projects.length + tasks.length >= 1;
