const { appSettingsModal } = require("../views");
const { viewsOpen, usersInfo } = require("../APIs/slack");
const { getTeamLeads } = require("../APIs/airtable");
module.exports = async ({ body, context, say, payload, ack, event }) => {
  try {
    ack();
  
    //get the data
    const slackUserID = body.user.id;
    const slackUserInfo = await usersInfo(slackUserID);
    const userEmail = slackUserInfo.profile.email;
    const teamLeadInfo = await getTeamLeads(userEmail);

 
    const formattedSettings = teamLeadInfo.map(record=>{
        return{
            id: record.id,
            name: record.fields.Name,
            email: record.fields["Email Address"],
            isAdmin: record.fields["Practices Admin"],
            sendDailyReminders: record.fields["Send Daily Reminder"]
        }
    })

    console.log(formattedSettings)
 

    const view = await appSettingsModal(formattedSettings[0]);

 

    viewsOpen({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: view
    });
  } catch (error) {
    console.error(error);
  }
};
