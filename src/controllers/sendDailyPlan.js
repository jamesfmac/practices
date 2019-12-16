const { TIMEZONE } = require("../../config");
const moment = require("moment-timezone");
const { dailyPlan } = require("../views");
const { chatPostDM, usersLookupByEmail } = require("../APIs/slack");
const { getPracticesLog } = require("../APIs/airtable");

module.exports = async email => {
  const userEmail = email || null;

  //define date range for the current day

  const date = moment().tz(TIMEZONE);

  const beforeDateFormattedForAirtable = date
    .clone()
    .add(1, "day")
    .format("YYYY-MM-DD");
  const afterDateFormattedForAirtable = date
    .clone()
    .subtract(1, "day")
    .format("YYYY-MM-DD");

  //helper functions

  const formatPractices = practices => {
    return practices.map(record => {
      return {
        id: record.id,
        email: record.fields.TEAM_LEAD_EMAIL[0],
        name: record.fields.PRACTICE_NAME[0],
        project: record.fields.PROJECT_NAME[0],
        date: record.fields.Date,
        status: record.fields.Status,
        schedule: record.fields._SCHEDULE[0],
        practiceID: record.fields.ACTIVE_PRACTICE_ID[0]
      };
    });
  };

  const groupPracticesByField = (array, field) => {
    const uniqueValuesInField = array
      .map(practice => practice[field])
      .filter((field, index, all) => all.indexOf(field) === index);

    const groupedPractices = uniqueValuesInField.map(x => {
      const practices = array.filter(practice => practice[field] === x);
      return {
        [field]: x,
        practices: practices
      };
    });
    return groupedPractices;
  };

  //fetch practices for today and format them

  const allPractices = await getPracticesLog({
    email: userEmail,
    afterDate: afterDateFormattedForAirtable,
    beforeDate: beforeDateFormattedForAirtable,
    sort: [
      { field: "Team Lead", direction: "desc" },
      { field: "Date", direction: "asc" }
    ]
  });

  const formattedPractices = formatPractices(allPractices);

  const practicesGroupedByPracticeName = groupPracticesByField(
    formattedPractices,
    "name"
  ).map(practice => {
    const projectsPracticeUsedIn = practice.practices.reduce(
      (total, currentVal) => {
        return total.includes(currentVal.project)
          ? total
          : [...total, currentVal.project];
      },
      []
    );
    return {
      name: practice.name,
      projects: projectsPracticeUsedIn
    };
  });

  const slackUser = await usersLookupByEmail(userEmail);

  const slackUserID = slackUser.ok ? slackUser.user.id : null;


  console.log({
    slackUserID: slackUserID,
    practices: practicesGroupedByPracticeName
  });

  //send the response
};
