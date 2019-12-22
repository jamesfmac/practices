const { admin, teamLeadCommands } = require("../views");
const { chatPostEphemeral } = require("../APIs/slack");

module.exports = async ({ body, context, ack, payload, say }) => {
  // Acknowledge command request

  ack();

  try {
    const isAdmin = context.isPbPAdmin
    const adminResponseMessage = await admin(body);
    const teamLeadResponseMessage = await teamLeadCommands(body);

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

