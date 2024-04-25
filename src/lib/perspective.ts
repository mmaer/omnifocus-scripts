type RuleObj = {
  [key: string]: string | boolean | number
}

export const isBuildInPerspective = (name: Perspective.BuiltIn) => Perspective.BuiltIn.all.includes(name);

export const setValueForRule = (perspective: Perspective.Custom, ruleName: string, ruleValue: string | boolean | number) => {
  const rulesObjArray = JSON.parse(JSON.stringify(perspective.archivedFilterRules));
	let didChange = false;

	for (const rulesObj of rulesObjArray) {
		if (rulesObj[ruleName] !== undefined) {
      rulesObj[ruleName] = ruleValue;
			didChange = true;
			break;
		}
	}

	if (!didChange) rulesObjArray.push({ [ruleName]: ruleValue });
	
	perspective.archivedFilterRules = rulesObjArray;
};

export const getValueForRule = (perspective: Perspective.Custom, ruleName: string) => 
  perspective.archivedFilterRules.find((rulesObj: RuleObj) => rulesObj[ruleName] !== undefined) || {};

export const deleteValueForRule = (perspective: Perspective.Custom, ruleName: string) => {
  const rulesObjArray = JSON.parse(JSON.stringify(perspective.archivedFilterRules));
  const updatedRules = rulesObjArray.filter((rulesObj: RuleObj) => rulesObj[ruleName] === undefined);
	
	perspective.archivedFilterRules = updatedRules;
};