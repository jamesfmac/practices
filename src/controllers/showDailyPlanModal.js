const { viewsOpen } = require("../APIs/slack");
const generateDailyPlan = require("./generateDailyPlan");

module.exports = async ({ body, context, ack }) => {
  ack();

  const slackUserID = body.user.id;

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
