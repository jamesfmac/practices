const { insertFeedback } = require("../APIs/airtable");

module.exports = async ({ ack, payload }) => {

  ack();

  try {
    const selection =payload.state.values["send-reminder-input"]["send-reminder-select"]["selected_option"]

      console.log('selection', selection)

    
  } catch (error) {
    console.log(error);
  }
};
