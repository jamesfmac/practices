const { updatePracticesLog } = require("../APIs/airtable/practicesLog");

module.exports = async ({ ack, payload, body, context, ...args }) => {
  ack();
  try {
    const splitInputValue = payload.selected_option.value.split("-");
    const recordID = splitInputValue[0];
    const newStatus =
      splitInputValue[1] == "completed" ? "Completed" : "Missed";

    const resultOfAirtableUpdate = await updatePracticesLog({
      id: recordID,
      fields: {
        Status: newStatus
      }
    });
    


  } catch (error) {
    console.error(error);
  }
};
