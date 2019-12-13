const { getTeamLeads } = require("../APIs/airtable");
const { admin, teamLeadCommands } = require("../views");
const { chatPostEphemeral, usersInfo } = require("../APIs/slack");

const practicelySlashCommand = async ({ body, context, ack, payload, say }) => {
  // Acknowledge command request

  ack();
  const slackUserInfo = await usersInfo(payload.user_id);
  try {
    const practicesUserInfo = await getTeamLeads(slackUserInfo.profile.email);
    const isAdmin = practicesUserInfo[0].get("Practices Admin")


    const adminResponseMessage = await admin(body);
    const teamLeadResponseMessage = await teamLeadCommands(body);

    if (practicesUserInfo == undefined) {
      chatPostEphemeral({
        token: context.botToken,
        user: payload.user_id,
        channel: body.channel_id,
        text: `Sorry I couldn't find a user account for you`,
        blocks: null
      });
    } else if (isAdmin) {
      chatPostEphemeral({
        token: context.botToken,
        user: payload.user_id,
        channel: body.channel_id,
        text: String(adminResponseMessage.text),
        blocks: adminResponseMessage.blocks
      });
    } else {
      chatPostEphemeral({
        token: context.botToken,
        user: payload.user_id,
        channel: body.channel_id,
        text: teamLeadResponseMessage.text,
        blocks: teamLeadResponseMessage.blocks
      });
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = practicelySlashCommand;
