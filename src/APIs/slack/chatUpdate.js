const { app } = require("../../bolt");
module.exports = messageUpdate => {
  app.client.chat.update({
    token: messageUpdate.token,
    ts: messageUpdate.ts,
    channel: messageUpdate.channel,
    text: messageUpdate.text,
    as_user: true,
    blocks: messageUpdate.blocks
  })
  .then(response => response)
  .catch(error =>{
    console.log('chat.update', error)
    return error
  })
};
