const { getUsersInfo } = require("../slack/utils");
const { getPracticesLog } = require("../APIs/airtable");
const { TIMEZONE } = require("../config");
const moment = require("moment-timezone");

const groupPracticesByDate = (list, date) => {
  return (
    list
      //  filter out items not matching the email address
      .filter(item => {
    
        return item.Date === date;
      })
      //  map the practice to the desired shape
      .map(record => {
        return {
          id: record.id,
          email: record.TEAM_LEAD_EMAIL[0],
          practice: record.PRACTICE_NAME[0],
          project: record.PROJECT_NAME[0],
          date: moment(record.Date).format("dddd, Do MMM"),
          status: record.Status
        };
      })
  );
};

const getUniqueDates = list => {
  return list
    .map(item => item.Date)
    .filter((date, index, all) => all.indexOf(date) === index);
};

module.exports = async ({ body, ack, say }) => {
  ack();
  try {
    //set up date ranges
    const todaysDate = moment().tz(TIMEZONE);
    const startOfMonth = todaysDate
      .clone()
      .startOf("month")
      .format("YYYY-MM-DD");

    const tomorrow = todaysDate
      .clone()
      .add(1, "day")
      .format("YYYY-MM-DD");

    const slackUserInfo = await getUsersInfo(body.user.id);
    say(slackUserInfo.profile.email);

    //get matching practice instances from Airtable

    const practices = await getPracticesLog({
      email: slackUserInfo.profile.email,
      status: "Pending",
      beforeDate: tomorrow,
      afterDate: startOfMonth
    });

    //group practices by date

    //get list of unique dates

    const uniqueDates = getUniqueDates(practices);
  

    const practicesGroupedByDate = await uniqueDates.map(date => {
      return {
        date: date,
        practices: groupPracticesByDate(practices, date)
      };
    });

    console.log(practicesGroupedByDate);

    //get view

    //open view
  } catch (error) {
    console.log(error);
  }
};
