const { getPracticesLog } = require("../APIs/airtable");
const { logPracticesModal } = require("../views");
const { TIMEZONE } = require("../../config");
const moment = require("moment-timezone");
const { viewsOpen, usersInfo } = require("../APIs/slack");

module.exports = async ({ body, context, ack, say }) => {
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

    //get matching practice instances from Airtable

    const practices = await getPracticesLog({
      email: slackUserInfo.profile.email,
      status: "Pending",
      beforeDate: tomorrow,
      afterDate: oneYearAgo,
      maxRecords: 25,
      sort: [{ field: "Date", direction: "desc" }]
    });

    //group practices by date

    const uniqueDates = getUniqueDates(practices);

    const practicesGroupedByDate = await uniqueDates.map(date => {
      return {
        date: date,
        practices: groupPracticesByDate(practices, date)
      };
    });

    //get view

    const view = await logPracticesModal(practicesGroupedByDate);

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

const groupPracticesByDate = (list, date) => {
  return (
    list
      //  filter out items not matching date
      .filter(item => {
        return item.fields.Date === date;
      })
      //  map the practice to the desired shape
      .map(record => {
        return {
          id: record.id,
          email: record.fields.TEAM_LEAD_EMAIL[0],
          practice: record.fields.PRACTICE_NAME[0],
          project: record.fields.PROJECT_NAME[0],
          date: moment(record.fields.Date).format("dddd, Do MMM"),
          status: record.fields.Status
        };
      })
  );
};

const getUniqueDates = list => {
  return list
    .map(item => item.fields.Date)
    .filter((date, index, all) => all.indexOf(date) === index);
};
