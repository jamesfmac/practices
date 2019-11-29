const { SLACK_BOT_TOKEN } = require("../../config");
const { app } = require("../../boltApp");

const postDM = async (email, text, blocks) => {
  try {
    console.log(`Attempting: DM to ${email}`);
    const user = await app.client.users.lookupByEmail({
      token: SLACK_BOT_TOKEN,
      email: String(email)
    });

    const response = await app.client.chat.postMessage({
      token: SLACK_BOT_TOKEN,
      as_user: true,
      channel: user.user.id,
      text: String(text),
      blocks: blocks
    });
    if (response.ok) {
      console.log(`Success: DM sent to ${email}`);
    } else {
      console.log(`Fail: DM failed for ${email}`);
    }

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = postDM;
