const { feedbackModal } = require("../views");
const { viewsOpen } = require("../APIs/slack");
const analytics = require("../APIs/segment")
module.exports = async ({ body, context,ack }) => {
  ack();

  try {
    const location = body.view? body.view.type: body.channel.name
    const view = await feedbackModal(body);
    viewsOpen({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: view
    });

    analytics.track({
      userId: body.user.id,
      event: 'App Button Clicked',
      properties: {
        button: "Open Feedback",
        location: location
      }
    })
  } catch (error) {
    console.error(error);
  }
};
