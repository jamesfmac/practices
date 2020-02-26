const refreshHome = require("./refreshHome");
const analytics = require("../APIs/segment");

module.exports = async context => {
  const slackUserID = context.event.user;
  const token = context.context.botToken;

  analytics.track({
    userId: slackUserID,
    event: "App Viewed",
    properties: {
      tab: context.payload.tab
    }
  });


    refreshHome(slackUserID, token);

};
