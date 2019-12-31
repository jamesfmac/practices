const { getPracticesLog } = require("../APIs/airtable");
const { TIMEZONE } = require("../../config");
const moment = require("moment-timezone");
const { usersLookupByEmail } = require("../APIs/slack");
const { overduePracticesReminder } = require("../views");

module.exports = async userEmail => {
  try {
    //set up date ranges
    const today = moment().tz(TIMEZONE);
    const tomorrow = today
      .clone()
      .add(1, "day")
      .format("YYYY-MM-DD");
  
    const oneYearAgo = today
      .clone()
      .subtract(1, "year")
      .format("YYYY-MM-DD");

    //get matching practice instances from Airtable

    const pendingPractices = await getPracticesLog({
      email: userEmail,
      status: "Pending",
      afterDate: oneYearAgo,
      beforeDate: tomorrow
    });
  

    const slackUser = await usersLookupByEmail(userEmail);

    const slackUserID = slackUser.ok ? slackUser.user.id : null;

    const view = await overduePracticesReminder(slackUserID, pendingPractices);

    return {
      userEmail: userEmail,
      slackUserID: slackUserID,
      view: view,
      practices: pendingPractices
    };
  } catch (error) {
    console.log(error);
  }
};
