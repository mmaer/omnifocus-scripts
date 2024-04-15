
const DEFAULT_TOTAL_TIME_TO_ESTIMATE = 0;

const preferences = new Preferences('estimate-days-settings');

export const getTotalTimeToEstimate = () => preferences.readNumber('total-time-to-estimate') || DEFAULT_TOTAL_TIME_TO_ESTIMATE;

export const settings = async () => {
  const inputForm = new Form();

  const totalTimeToEstimateInput = new Form.Field.String(
    'totalTimeToEstimatePerDay', 
    'Time in minutes to estimate per day', 
    getTotalTimeToEstimate(), 
    null
  );

  inputForm.addField(totalTimeToEstimateInput, null);

  inputForm.validate = ({ values: { totalTimeToEstimatePerDay }}: { values: { totalTimeToEstimatePerDay: string } }) => {
    return !isNaN(parseInt(totalTimeToEstimatePerDay));
  };

  const { values: { totalTimeToEstimatePerDay } } = await inputForm.show('Settings', 'Save');

  preferences.write('total-time-to-estimate', parseInt(totalTimeToEstimatePerDay));
};
