const { SLACK_BOT_TOKEN } = require("../../config");
const { app } = require("../../boltApp");

const getUsersInfo = async user_id => {
  try {
 
    const response = await app.client.users.info({
      token: SLACK_BOT_TOKEN,
      user: user_id
    });
    if (response.ok) {
      return response.user;
    } else {
      return response.error;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = getUsersInfo;
