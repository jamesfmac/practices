const {app} = require("../../boltApp")
const { getUsersInfo } = require("../utils");
const {generatePractices} = require ("../../methods")


const my_practicesActionHandler = async ({
  body,
  ack,
  context,
  action,
  payload
}) => {
 
  ack();
  const slackUserInfo = await getUsersInfo(body.user.id);
  result = generatePractices()
  app.say(result)
  try {
  } catch (error) {
    console.log(error);
  }
};
module.exports = my_practicesActionHandler;
