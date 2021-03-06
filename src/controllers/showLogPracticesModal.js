const { getPracticesLog } = require("../APIs/airtable");
const { logPracticesModal } = require("../views");
const { TIMEZONE } = require("../../config");
const moment = require("moment-timezone");
const { viewsOpen, usersInfo } = require("../APIs/slack");
const formatPracticesForLogPracticesModal = require("./formatPracticesForLogPracticesModal");
const analytics = require("../APIs/segment");

module.exports = async ({ body, context, ack }) => {
  ack();
  try {
    //set up date ranges
    const todaysDate = moment().tz(TIMEZONE);
    const oneYearAgo = todaysDate
      .clone()
      .subtract(1, "year")
      .format("YYYY-MM-DD");
    const startOfMonth = todaysDate
      .clone()
      .startOf("month")
      .format("YYYY-MM-DD");

    const tomorrow = todaysDate
      .clone()
      .add(1, "day")
      .format("YYYY-MM-DD");

    const slackUserInfo = await usersInfo(body.user.id);
    const location = body.view ? body.view.type : body.channel.name;
    //get matching practice instances from Airtable

    const practices = await getPracticesLog({
      email: slackUserInfo.profile.email,
      status: "Pending",
      beforeDate: tomorrow,
      afterDate: oneYearAgo,
      maxRecords: 25,
      sort: [{ field: "Date", direction: "desc" }]
    });

    //get view

    const formattedPractices = await formatPracticesForLogPracticesModal(
      practices
    );

    analytics.track({
      userId: body.user.id,
      event: "App Button Clicked",
      properties: {
        button: "Update Practices",
        location: location
      }
    });

    const view = await logPracticesModal(
      formattedPractices.practicesGroupedByDate,
      formattedPractices.listOfPracticeIDs
    );

    //open view

    viewsOpen({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: view
    });
  } catch (error) {
    console.log("viewsOpen", error);
  }
};
