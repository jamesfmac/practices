const { updateTeamLeads } = require("../APIs/airtable");
const analytics = require("../APIs/segment");
module.exports = async ({ ack, payload, body, view }) => {
  try {
    ack();

    const airtableRecordID = view.private_metadata;

    const sendDailyReminderSelection = [
      payload.state.values["send-reminder-input"]["send-reminder-select"][
        "selected_option"
      ]["value"]
    ]
      .map(selection =>
        selection == "EOW+Daily" ? ["Daily", "End of Week"] : [selection]
      )
      .reduce((final, value) => {
        return final.concat(value);
      }, []);

    const sendDailyPlanSelection = [
      payload.state.values["send-plan-input"]["send-plan-select"][
        "selected_option"
      ]["value"]
    ]
      .map(selection => {
        console.log("selection", selection);
        return selection == "SOW+Daily"
          ? ["Daily", "Start of Week"]
          : [selection];
      })
      .reduce((final, value) => {
        return final.concat(value);
      }, []);

    updateTeamLeads([
      {
        id: airtableRecordID,
        fields: {
          "Overdue Practices Reminder": sendDailyReminderSelection,
          "Planned Practices Reminder": sendDailyPlanSelection
        }
      }
    ]);
    analytics.track({
      userId: body.user.id,
      event: "Settings Updated",
      properties: {
        "Overdue Practices Reminder": sendDailyReminderSelection,
        "Planned Practices Reminder": sendDailyPlanSelection
      }
    });
  } catch (error) {
    console.log(error);
  }
};
