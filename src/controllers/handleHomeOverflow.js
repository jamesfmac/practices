const analytics = require("../APIs/segment");
const showAppSettingsModal = require("./showAppSettingsModal");
const showFeedbackModal = require("./showFeedbackModal");

module.exports = async ({ body, context, ack, payload }) => {
  ack();

  const choice = payload.selected_option.value;
  const slackUserID = body.user.id;
  const token = context.botToken;
  const tab = payload.value;
  const location = body.view ? body.view.type : body.channel.name;

  if (choice == "settings") {
    showAppSettingsModal({ body, context, ack });
  } else {
    showFeedbackModal({ body, context, ack });
  }

  analytics.track({
    userId: slackUserID,
    event: "App Button Clicked",
    properties: {
      button: `Overflow - ${choice}`,
      location: location
    }
  });
};
