const { appSettingsModal } = require("../views");
const { viewsOpen } = require("../APIs/slack");
const { getTeamLeads } = require("../APIs/airtable");
const analytics = require("../APIs/segment");

module.exports = async ({ body, context, ack }) => {
  try {
    ack();

    //get the data

    const userEmail = context.userEmail;
    const teamLeadInfo = await getTeamLeads(userEmail);

    const formattedSettings = teamLeadInfo.map(record => {
      return {
        id: record.id,
        name: record.fields.Name,
        email: record.fields["Email Address"],
        isAdmin: record.fields["Practices Admin"],
        sendDailyReminders: record.fields["Send Daily Reminder"],
        sendDailyPlan: record.fields["Send Daily Planned Practices"]
      };
    });

    const view = await appSettingsModal(formattedSettings[0]);

    viewsOpen({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: view
    });
    analytics.track({
      userId: context.slackUserID,
      event: "Settings Viewed"
    });

  } catch (error) {
    console.error(error);
  }
};
