const { getTeamLeads } = require("../APIs/airtable");
const { chatPostDM } = require("../APIs/slack");
const  generateOverdueReminder  = require("../controllers/generateOverdueReminder");//importing directly to get around a loading order issue

module.exports = async () => {
  try {
    const teamLeads = await getTeamLeads(null);

    for (const teamLead of teamLeads) {

      const userEmail = teamLead.fields["Email Address"];
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
