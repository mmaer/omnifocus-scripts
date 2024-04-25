import { changeIcon } from '../../lib';
import { getValueForRule, isBuildInPerspective, setValueForRule } from '../../lib/perspective';

const RULE_NAME = 'actionAvailability';
const LABEL = 'Toggle availability';

const action = new PlugIn.Action(({ window }: Selection, sender: ToolbarItem) => {
  const customPerspective = Perspective.Custom.byName(window.perspective.name);
  const valueRule = getValueForRule(customPerspective, RULE_NAME);

  if (valueRule[RULE_NAME] === 'remaining') {
    setValueForRule(customPerspective, RULE_NAME, 'available');
    changeIcon(sender, `${LABEL} - available`, 'circle.fill');
  } else {
    setValueForRule(customPerspective, RULE_NAME, 'remaining');
    changeIcon(sender, `${LABEL} - remaining`, 'circle');
  }
});

action.validate = ({ window }: Selection, sender: ToolbarItem) => {
  const buildInPerspective = isBuildInPerspective(window.perspective);
  if (buildInPerspective) return false;

  const customPerspective = Perspective.Custom.byName(window.perspective.name);
  const valueRule = getValueForRule(customPerspective, RULE_NAME);

  if (valueRule[RULE_NAME] === 'remaining') {
    changeIcon(sender, `${LABEL} - available`, 'circle');
  } else {
    changeIcon(sender, `${LABEL} - remaining`, 'circle.fill');
  }

  return true;
};
