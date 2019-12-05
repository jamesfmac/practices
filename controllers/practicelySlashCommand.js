const { getTeamLead } = require("../APIs/airtable");
const { getUsersInfo } = require("../slack/utils");
const { admin, teamLeadCommands } = require("../views");
const { chatPostEphemeral } = require("../APIs/slack");

const practicelySlashCommand = async ({ body, context, ack, payload, say }) => {
  // Acknowledge command request

  ack();
  const slackUserInfo = await getUsersInfo(payload.user_id);
  try {
    const practicesUserInfo = await getTeamLead(slackUserInfo.profile.email);

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
    } else if (practicesUserInfo["Practices Admin"]) {
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
