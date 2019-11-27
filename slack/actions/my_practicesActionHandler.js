const { getUsersInfo } = require("../utils");
const {sendReminders} = require ("../../scripts")

const my_practicesActionHandler = async ({
  body,
  ack,
  context,
  action,
  payload
}) => {
 
  ack();
  const slackUserInfo = await getUsersInfo(body.user.id);
  sendReminders(slackUserInfo.profile.email);
  try {
  } catch (error) {
    console.log(error);
  }
};
module.exports = my_practicesActionHandler;
