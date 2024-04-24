const DEFAULT_TOTAL_TIME_TO_ESTIMATE = 0;

const TOTAL_TIME_TO_ESTIMATE = 'total-time-to-estimate';
const SHOW_DAYS_WITH_NO_TIME = 'total-time-to-estimate';

const preferences = new Preferences('estimate-days-settings');

export const getTotalTimeToEstimate = () => preferences.readNumber(TOTAL_TIME_TO_ESTIMATE) || DEFAULT_TOTAL_TIME_TO_ESTIMATE;
export const getShowDaysWithNoTime = () => preferences.readBoolean(SHOW_DAYS_WITH_NO_TIME);

export const settings = async () => {
  const inputForm = new Form();

  inputForm.addField(new Form.Field.String(
    'totalTimeToEstimatePerDay', 
    'Time(minutes) to estimate per day', 
    getTotalTimeToEstimate(), 
    null
  ), null);

  inputForm.addField(new Form.Field.Checkbox(
    'showDaysWithNoTime', 
    'Show days with 0 minutes', 
    getShowDaysWithNoTime()
  ), null);

  inputForm.validate = ({ values: { totalTimeToEstimatePerDay }}: { values: { totalTimeToEstimatePerDay: string } }) => {
    return !isNaN(parseInt(totalTimeToEstimatePerDay));
  };

  const { values: { totalTimeToEstimatePerDay, showDaysWithNoTime } } = await inputForm.show('Settings', 'Save');

  preferences.write(TOTAL_TIME_TO_ESTIMATE, parseInt(totalTimeToEstimatePerDay));
  preferences.write(SHOW_DAYS_WITH_NO_TIME, showDaysWithNoTime);
};
