const { TIMEZONE } = require("../../config");
const moment = require("moment-timezone");
const analytics = require("../APIs/segment");

const { chatPostDM, usersLookupByEmail } = require("../APIs/slack");
const { getPracticesLog, getTeamLeads } = require("../APIs/airtable");

const { practicesReminderInline } = require("../views");

const groupPracticesByTeamLeadEmail = (list, email) => {
  return (
    list
      //  filter out items not matching the email address
      .filter(item => item.fields.TEAM_LEAD_EMAIL[0] === email)
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

//TODO update to handle multiple team leads
const getListOfUniqueTeamLeads = list => {
  return list
    .map(item => item.fields.TEAM_LEAD_EMAIL[0])
    .filter((person, index, all) => all.indexOf(person) === index);
};

const createAndDispatchSlackDMs = async groupedPractices => {
  for (const group of groupedPractices) {
    const slackUser = await usersLookupByEmail(group.email);
    const slackUserID = slackUser.ok ? slackUser.user.id : false;

    if (slackUserID) {
      console.log(
        `Sending ${group.practices.length} practices to ${group.email}`
      );

      const blockkitMessage = await practicesReminderInline(group);
      const chatPostResult = await chatPostDM(
        group.email,
        blockkitMessage.text,
        blockkitMessage.blocks
      );

      if (chatPostResult.ok) {
        analytics.track({
          userId: slackUserID,
          event: `Message Recieved`,
          properties: {
            message: "Daily Overdue Reminder"
          }
        });
      }
    }
  }
};

const sendReminders = async email => {
  try {
    //Set up the dates that we need to find the practices due today
    const userEmail = email || null;
    if (userEmail) {
      console.log(`Checking practice reminders for ${userEmail}`);
    } else {
      console.log("Checking practice reminders for all team leads");
    }

    const date = moment().tz(TIMEZONE);

    const teamLeadsWantingReminders = await getTeamLeads().then(records =>
      records
        .filter(record => {
          const userOverduePracticesSettings = record.get(
            "Overdue Practices Reminder"
          );
          return userOverduePracticesSettings
            ? userOverduePracticesSettings.includes("Daily")
            : false;
        })
        .map(record => {
          return record.get("Email Address");
        })
    );

    //get a list of the practices due today, group them by team lead email and shape data

    const todaysPractices = await getPracticesLog({
      afterDate: date
        .clone()
        .subtract(1, "day")
        .format("YYYY-MM-DD"),
      beforeDate: date
        .clone()
        .add(1, "day")
        .format("YYYY-MM-DD"),
      status: "Pending",
      email: userEmail
    });

    const practicesNeedingReminding = todaysPractices.filter(practice => {
      return teamLeadsWantingReminders.includes(
        practice.fields["TEAM_LEAD_EMAIL"][0]
      );
    });

    const listOfTeamLeadsWithPracticesDue = getListOfUniqueTeamLeads(
      practicesNeedingReminding
    );
    console.log(
      `Pending practices found for: ${listOfTeamLeadsWithPracticesDue}`
    );

    const formattedTodaysPractices = await listOfTeamLeadsWithPracticesDue.map(
      x => {
        return {
          email: x,
          practices: groupPracticesByTeamLeadEmail(todaysPractices, x)
        };
      }
    );

    //Create and send the Slack messages

    createAndDispatchSlackDMs(formattedTodaysPractices);

    return formattedTodaysPractices;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendReminders;
