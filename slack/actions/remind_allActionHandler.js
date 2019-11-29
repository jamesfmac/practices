const { getUsersInfo } = require("../utils");
const {sendReminders} = require ("../../scripts")

const remind_allActionHandler = async ({
  body,
  ack,
  context,
  action,
  payload
}) => {
 
  ack();
  const slackUserInfo = await getUsersInfo(body.user.id);
  sendReminders();
  try {
  } catch (error) {
    console.log(error);
  }
};
module.exports = remind_allActionHandler;
