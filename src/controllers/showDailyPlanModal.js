const { viewsOpen } = require("../APIs/slack");
const generateDailyPlan = require("./generateDailyPlan");
const analytics = require("../APIs/segment")

module.exports = async ({ body, context, ack }) => {
  ack();

  const slackUserID = body.user.id;

  const location = body.view? body.view.type: body.channel.name

  analytics.track({
    userId: slackUserID, 
    event: 'App Button Clicked',
    properties: {
      button: "Show Todays Practices",
      location: location
    }
  })

  const dailyPlan = await generateDailyPlan({
    email: null,
    userID: slackUserID,
    isForModal: true
  });

  viewsOpen({
    token: context.botToken,
    trigger_id: body.trigger_id,
    view: dailyPlan.view
  });

};
