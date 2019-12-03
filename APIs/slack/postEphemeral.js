const { app } = require("../../boltApp");

module.exports = message => {
  try {
    app.client.chat
      .postEphemeral({
        token: message.token,
        user: message.user,
        as_user: false,
        channel: message.channel,
        text: message.text,
        blocks: message.blocks
      })
      .catch(error => {
        console.log("error", error);
        // throw error
      });
  } catch (error) {
    console.log(error);
  }
};
