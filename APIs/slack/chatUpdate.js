const { app } = require("../../boltApp");
module.exports = messageUpdate => {
  app.client.chat.update({
    token: messageUpdate.token,
    ts: messageUpdate.ts,
    channel: messageUpdate.channel,
    text: messageUpdate.text,
    as_user: true,
    blocks: messageUpdate.blocks
  });
};
