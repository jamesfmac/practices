const { app } = require("../../boltApp");
const { sendReminders, generatePractices } = require("../../scripts");
const { getTeamLead } = require("../../airtable");
const { getUsersInfo } = require("../utils");
const { admin } = require("../messages");

const practicelyHandler = async ({ body, context, ack, payload, say }) => {
  // Acknowledge command request

  ack();
  const slackUserInfo = await getUsersInfo(payload.user_id);
  const practicesUserInfo = await getTeamLead(slackUserInfo.profile.email);

  console.log(practicesUserInfo);

  const responseMessage = await admin(body);

  const input = payload.text;

  switch (input) {
    case "ping":
      say("Status OK");
      break;
    case "admin":
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
            text: "Access denied. You are not listed as a practicely admin."
          })
          .catch(error => console.log(error));
      }
      break;
    case "mine":
      sendReminders(slackUserInfo.profile.email);
      break;
    case "remind":
      sendReminders();
      say("Reminders away");
      break;
    case "create":
      generatePractices();
      say("Creating practices");
      break;
    default:
      say("I don't know that one");
  }
};

module.exports = practicelyHandler;
