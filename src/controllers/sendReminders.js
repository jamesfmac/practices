const { sendReminders } = require("../methods");

module.exports = async ({ body, ack, context, action, payload }) => {
  ack();

  sendReminders();
  try {
  } catch (error) {
    console.log(error);
  }
};
