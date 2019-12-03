
const {sendReminders} = require ("../../methods")

const remind_allActionHandler = async ({
  body,
  ack,
  context,
  action,
  payload
}) => {
 
  ack();

  sendReminders();
  try {
  } catch (error) {
    console.log(error);
  }
};
module.exports = remind_allActionHandler;
