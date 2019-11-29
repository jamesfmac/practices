const { app } = require("../../boltApp");
const { sendReminders, generatePractices } = require("../../scripts");
const { getTeamLead } = require("../../airtable");
const { getUsersInfo } = require("../utils");
const { admin } = require("../messages");

const practicelySlashHandler = async ({ body, context, ack, payload, say }) => {
  // Acknowledge command request

  ack();
  const slackUserInfo = await getUsersInfo(payload.user_id);
  const practicesUserInfo = await getTeamLead(slackUserInfo.profile.email);

  const responseMessage = await admin(body);

  const input = payload.text;

  if (practicesUserInfo["Practices Admin"]) {
    app.client.chat
      .postEphemeral({
        token: context.botToken,
        user: payload.user_id,
        as_user: false,
        channel: body.channel_id,
        text: String(responseMessage.text),
        blocks: responseMessage.blocks
      })
      .catch(error => console.log(error));
  } else {
    app.client.chat
      .postEphemeral({
        token: context.botToken,
        user: payload.user_id,
        as_user: false,
        channel: body.channel_id,
        text: "Access denied. Sorry, you are not listed as a Practicely admin."
      })
      .catch(error => console.log(error));
  }
};

module.exports = practicelySlashHandler;
