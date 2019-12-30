const { admin, teamLeadCommands } = require("../views");
const { chatPostEphemeral } = require("../APIs/slack");
const analytics = require("../APIs/segment");

module.exports = async ({ body, context, ack, payload }) => {
  // Acknowledge command request

  ack();

  try {
    const isAdmin = context.isPbPAdmin;
    const adminResponseMessage = await admin(body);
    const teamLeadResponseMessage = await teamLeadCommands(body);

    analytics.track({
      userId: context.slackUserID,
      event: "Slash Command",
      properties: {
        command: body.command,
        channel: body.channel_name,
        isAdmin: isAdmin
      }
    });

    if (isAdmin) {
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
