import { changeIcon } from '../../lib';
import { getValueForRule, deleteValueForRule, setValueForRule, isBuildInPerspective } from '../../lib/perspective';

const RULE_NAME = 'actionHasDuration';

const action = new PlugIn.Action(({ window }: Selection, sender: ToolbarItem) => {
  const customPerspective = Perspective.Custom.byName(window.perspective.name);
  const valueRule = getValueForRule(customPerspective, RULE_NAME);

  if (valueRule[RULE_NAME]) {
    deleteValueForRule(customPerspective, RULE_NAME);
    changeIcon(sender, 'Toggle has duration - disabled', 'deskclock');
  } else {
    setValueForRule(customPerspective, RULE_NAME, true);
    changeIcon(sender, 'Toggle has duration - enabled', 'deskclock.fill');
  }
});

action.validate = ({ window }: Selection, sender: ToolbarItem) => {
  const buildInPerspective = isBuildInPerspective(window.perspective);
  if (buildInPerspective) return false;

  const customPerspective = Perspective.Custom.byName(window.perspective.name);
  const valueRule = getValueForRule(customPerspective, RULE_NAME);

  if (valueRule[RULE_NAME]) {
    changeIcon(sender, 'Toggle has duration - enabled', 'deskclock.fill');
  } else {
    changeIcon(sender, 'Toggle has duration - disabled', 'deskclock');
  }

  return true;
};
