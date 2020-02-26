const refreshHome = require("./refreshHome");
const analytics = require("../APIs/segment");

module.exports = async ({ body, context, ack, payload }) => {
  ack();

  const slackUserID = body.user.id;
  const token = context.botToken;
  const tab = payload.value;
  const location = body.view ? body.view.type : body.channel.name;

  analytics.track({
    userId: slackUserID,
    event: "App Button Clicked",
    properties: {
      button: "Show Projects Tab",
      location: location
    }
  });
  refreshHome(slackUserID, token, tab);
};
