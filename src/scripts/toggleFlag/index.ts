import { changeIcon } from '../../lib';
import { getValueForRule, isBuildInPerspective, setValueForRule, deleteValueForRule } from '../../lib/perspective';

const RULE_NAME = 'actionStatus';
const LABEL = 'Toggle Flag';

const action = new PlugIn.Action(({ window }: Selection, sender: ToolbarItem) => {
  const customPerspective = Perspective.Custom.byName(window.perspective.name);
  const valueRule = getValueForRule(customPerspective, RULE_NAME);

  // Only flaged tasks
  if (valueRule[RULE_NAME] === 'flagged') {
    deleteValueForRule(customPerspective, RULE_NAME);
    changeIcon(sender, `${LABEL} - flagged`, 'flag.fill');
  // Flaged and not flaged tasks
  } else {
    setValueForRule(customPerspective, RULE_NAME, 'flagged');
    changeIcon(sender, `${LABEL} - flagged and unflagged`, 'flag.filled.and.flag.crossed');
  }
});

action.validate = ({ window }: Selection, sender: ToolbarItem) => {
  const buildInPerspective = isBuildInPerspective(window.perspective);
  if (buildInPerspective) return false;

  const customPerspective = Perspective.Custom.byName(window.perspective.name);
  const valueRule = getValueForRule(customPerspective, RULE_NAME);

  // Only flaged tasks
  if (valueRule[RULE_NAME] === 'flagged') {
    changeIcon(sender, `${LABEL} - flagged`, 'flag.fill');
  // Flaged and not flaged tasks
  } else {
    changeIcon(sender, `${LABEL} - flagged and unflagged`, 'flag.filled.and.flag.crossed');
  }

  return true;
};
