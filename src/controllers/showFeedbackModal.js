const { feedbackModal } = require("../views");
const { viewsOpen } = require("../APIs/slack");
module.exports = async ({ body, context, say, payload, ack, event }) => {
  ack();
  console.log(feedbackModal);

  try {
    const view = await feedbackModal(body);
    viewsOpen({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: view
    });
  } catch (error) {
    console.error(error);
  }
};
