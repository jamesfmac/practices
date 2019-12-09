const { SLACK_BOT_TOKEN } = require("../../../config");
const { app } = require("../../bolt");

module.exports = async email => {
  console.log(`Finding slack user for ${email}`);
  const user = await app.client.users
    .lookupByEmail({
      token: SLACK_BOT_TOKEN,
      email: String(email)
    })
    .then(user => {
      return user;
    })
    .catch(error => {
      console.error(error);

      return error.data;
    });

  return user;
};
