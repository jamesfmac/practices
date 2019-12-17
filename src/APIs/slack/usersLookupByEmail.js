const { SLACK_BOT_TOKEN } = require("../../../config");
const { app } = require("../../bolt");

module.exports = async email => {
  const user = await app.client.users
    .lookupByEmail({
      token: SLACK_BOT_TOKEN,
      email: String(email)
    })
    .then(user => {
      return user;
    })
    .catch(error => {
      console.error('usersLookupByEmail error', error.data);
      

      return error.data;
    });

  return user;
};
