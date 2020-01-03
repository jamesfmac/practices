const { getTeamLeads } = require("../APIs/airtable");
const { chatPostDM } = require("../APIs/slack");
const generateOverdueReminder = require("../controllers/generateOverdueReminder"); //importing directly to get around a loading order issue

module.exports = async () => {
  try {
    const teamLeadsWantingReminders = await getTeamLeads(null).then(records =>
      records.filter(record => {
        const userOverduePracticesSettings = record.get(
          "Overdue Practices Reminder"
        );
        return userOverduePracticesSettings
          ? userOverduePracticesSettings.includes("End of Week")
          : false;
      })
    );

    for (const teamLead of teamLeadsWantingReminders) {
      const userEmail = teamLead.fields["Email Address"];
      const userOverduePracticesSettings =
        teamLead.fields["Overdue Practices Reminder"];

      console.log("Checking overdue practices for ", userEmail);
      const reminder = await generateOverdueReminder(userEmail);

      if (reminder.slackUserID && reminder.practices.length > 0) {
        chatPostDM(
          reminder.userEmail,
          reminder.view.text,
          reminder.view.blocks
        );
      } else {
        console.log("No reminder needed for", userEmail);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
