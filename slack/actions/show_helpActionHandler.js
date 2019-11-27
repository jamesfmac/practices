const { app } = require("../../boltApp");

const show_helpActionHandler = async ({
  body,
  ack,
  context,
  action,
  payload,
  say
}) => {
  try {
    ack();
    say(`:face_with_monocle: hmm I don't yet know how to help`)
  } catch (error) {
    console.log(error);
  }
};
module.exports = show_helpActionHandler;
