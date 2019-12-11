const { TIMEZONE } = require("../../config");
const moment = require("moment-timezone");
const { weeklyPlan } = require("../views");
const { viewsOpen, usersInfo } = require("../APIs/slack");
const { getPracticesLog } = require("../APIs/airtable");

module.exports = async ({ body, context, ack }) => {
  ack();

  console.log(context);
  //get the user details
  const slackUserID = body.user.id;
  const slackUserInfo = await usersInfo(slackUserID);
  const userEmail = slackUserInfo.profile.email || null;

  //define date range for the current week

  const date = moment().tz(TIMEZONE);

  const startOfWeek = date.clone().startOf("isoWeek");
  const endOfWeek = date.clone().endOf("isoWeek");

  const startDateForAirTableFilter = startOfWeek
    .clone()
    .subtract(1, "day")
    .format("YYYY-MM-DD");
  const endDateForAirTableFilter = endOfWeek
    .clone()
    .add(1, "day")
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

  //fetch practices for the week

  const allPractices = await getPracticesLog({
    email: userEmail,
    afterDate: startDateForAirTableFilter,
    beforeDate: endDateForAirTableFilter,
    sort: [
      { field: "Team Lead", direction: "desc" },
      { field: "Date", direction: "asc" }
    ]
  });

  const formattedPractices = await formatPractices(allPractices);

  const practicesGroupedByTeamLead = await groupPracticesByField(
    formattedPractices,
    "email"
  );

  const promises = practicesGroupedByTeamLead.map(async group => {
    const dailyPractices = group.practices.filter(
      practice => practice.schedule == "Daily"
    );
    const uniqueAndFormattedDailyPractices = groupPracticesByField(
      dailyPractices,
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

    const practiceCalendar = groupPracticesByField(group.practices, "date").map(
      day => {
        const filteredPractices = day.practices.filter(
          practice => practice.schedule != "Daily"
        );
        return {
          date: day.date,
          practices: filteredPractices
        };
      }
    );

    return {
      email: group.email,
      slackID: slackUserID,
      dailyPractices: uniqueAndFormattedDailyPractices,
      week: practiceCalendar
    };
  });

  const practicesFormattedToSend = await Promise.all(promises);

  const view = weeklyPlan(practicesFormattedToSend[0], true);

  console.log(practicesFormattedToSend);

  viewsOpen({
    token: context.botToken,
    trigger_id: body.trigger_id,
    view: view
  });
};
