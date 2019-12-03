const { getTeamLead } = require("../APIs/airtable");
const { getUsersInfo } = require("../slack/utils");
const { admin } = require("../slack/messages");
const { postEphemeral } = require("../APIs/slack");

const practicelySlashCommand = async ({ body, context, ack, payload, say }) => {
  // Acknowledge command request

  ack();
  const slackUserInfo = await getUsersInfo(payload.user_id);
  try {
    const practicesUserInfo = await getTeamLead(slackUserInfo.profile.email);

    const responseMessage = await admin(body);

    if (practicesUserInfo == undefined) {
      postEphemeral({
        token: context.botToken,
        user: payload.user_id,
        channel: body.channel_id,
        text: `Sorry I couldn't find a user account for you`,
        blocks: null
      });
    } else if (practicesUserInfo["Practices Admin"]) {
      postEphemeral({
        token: context.botToken,
        user: payload.user_id,
        channel: body.channel_id,
        text: String(responseMessage.text),
        blocks: responseMessage.blocks
      })
    } else {
      postEphemeral({
        token: context.botToken,
        user: payload.user_id,
        channel: body.channel_id,
        text: `Access denied. Sorry, you are not listed as a Practicely admin.`,
        blocks: null
      });
    }
  } catch (error) {
    console.log(error)
  }
};
module.exports = practicelySlashCommand;
