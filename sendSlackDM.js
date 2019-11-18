const { SLACK_BOT_TOKEN } = require("./config");
const { app } = require("./app");

const sendSlackDM = async (email, text, blocks) => {
  
  try {
    console.log(`Attempting - Send DM to: ${email}`);
    const user = await app.client.users.lookupByEmail({
      token: SLACK_BOT_TOKEN,
      email: String(email)
    });

    const response =  await app.client.chat.postMessage({
      token: SLACK_BOT_TOKEN,
      as_user: true,
      channel: user.user.id,
      text: String(text),
      blocks: blocks
    });
    if(response.ok){
      console.log(`Success - DM sent to user: ${email}`)
    }
    else{
      console.log(`Fail - DM failed for user: ${email}`)
    }
  } catch (error) {
    console.log(`Fai`);
  }
};

module.exports = {
  sendSlackDM
};
