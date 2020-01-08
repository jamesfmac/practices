const { TIMEZONE } = require("../../config");
const moment = require("moment-timezone");
const { weeklyPlan } = require("../views");
const { chatPostDM, usersLookupByEmail } = require("../APIs/slack");
const { getPracticesLog, getTeamLeads } = require("../APIs/airtable");
const analytics = require("../APIs/segment")

module.exports = async email => {
  const userEmail = email || null;

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

  //fetch practices for that range

  const allPractices = await getPracticesLog({
    email: userEmail,
    afterDate: startDateForAirTableFilter,
    beforeDate: endDateForAirTableFilter,
    sort: [
      { field: "Team Lead", direction: "desc" },
      { field: "Date", direction: "asc" }
    ]
  });

  const formattedPractices = formatPractices(allPractices);

  const practicesGroupedByTeamLead = await groupPracticesByField(
    formattedPractices,
    "email"
  );

  const promises = practicesGroupedByTeamLead.map(async group => {
    const slackUser = await usersLookupByEmail(group.email);

    const slackUserID = slackUser.ok ? slackUser.user.id : null;

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

  for (const message of practicesFormattedToSend) {
    console.log(`Sending weekly plan to ${message.email}`);

    const teamLead = await getTeamLeads(message.email);

    const userPlannedPracticesSettings =
      teamLead[0].fields["Planned Practices Reminder"];

    const userWantsWeeklyPlan = userPlannedPracticesSettings
      ? userPlannedPracticesSettings.includes("Start of Week")
      : false;

    if (userWantsWeeklyPlan) {
      const view = weeklyPlan(message);
      const chatPostResult = await chatPostDM(
        message.email,
        view.text,
        view.blocks
      );

      chatPostResult.ok
        ? analytics.track({
            userId: message.slackID,
            event: `Message Recieved`,
            properties: {
              message: "Weekly Plan"
            }
          })
        : null;
    }
  }
};
