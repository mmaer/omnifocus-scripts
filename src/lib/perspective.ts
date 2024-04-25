type Value = string | boolean | number

type Rule = {
  [key: string]: Value
}

export const isBuildInPerspective = (name: Perspective.BuiltIn) => Perspective.BuiltIn.all.includes(name);

export const setValueForRule = (perspective: Perspective.Custom, name: string, value: Value) => {
  const rules = JSON.parse(JSON.stringify(perspective.archivedFilterRules));
  let foundRule = false;

  for (const rule of rules) {
    if (rule[name] !== undefined) {
      rule[name] = value;
      foundRule = true;
      break;
    }
  }

  if (!foundRule) rules.push({ [name]: value });

  perspective.archivedFilterRules = rules;
};

export const getValueForRule = (perspective: Perspective.Custom, name: string) =>
  perspective.archivedFilterRules.find((rule: Rule) => rule[name] !== undefined) || {};

export const deleteValueForRule = (perspective: Perspective.Custom, name: string) => {
  const rules = JSON.parse(JSON.stringify(perspective.archivedFilterRules));
  const updatedRules = rules.filter((rule: Rule) => rule[name] === undefined);

  perspective.archivedFilterRules = updatedRules;
};