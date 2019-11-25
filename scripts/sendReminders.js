const { AIRTABLE_BASE_ID } = require("../config");
const base = require("airtable").base(AIRTABLE_BASE_ID);
const timezone = "Australia/Sydney";
const { sendSlackDM } = require("../sendSlackDM");
const {
  practicesReminder
} = require("../slack-layouts/messages/practicesReminder");
const {
  practicesReminderAlt
} = require("../slack-layouts/messages/practicesRemindersAlt");
//Set up the dates that we need to find the practices due today
const moment = require("moment-timezone");
const date = moment().tz(timezone);
const week = () => {
  return date.week() % 2 ? 2 : 1;
};

const dateFormattedForAirtable = date.format("YYYY-MM-DD");

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

const getListOfUniqueTeamLeads = list => {
  return list
    .map(item => item.fields.TEAM_LEAD_EMAIL[0])
    .filter((person, index, all) => all.indexOf(person) === index);
};

const createAndDispatchSlackDMs = async groupedPractices => {
  for (const group of groupedPractices) {
    console.log(
      `Sending ${group.practices.length} practices to ${group.email}`
    );

    const blockkitMessage = await practicesReminderAlt(group);

    await sendSlackDM(
      group.email,
      blockkitMessage.text,
      blockkitMessage.blocks
    );
  }
};

const sendReminders = async () => {
  try {
    console.log(`Sending practice reminders for: ${dateFormattedForAirtable}`);
    const practices = base("Practices Log");

    const lookupFormula = `AND(IS_SAME(Date,"${dateFormattedForAirtable}", 'day' ), Status = 'Pending',Team_Lead_Email!="" )`;

    //get a list of the practices due today, group them by team lead email and shape data

    const todaysPractices = await practices
      .select({
        view: "All Logged Practices",
        filterByFormula: lookupFormula
      })
      .firstPage()
      .then(records => {
        return [].concat.apply(
          [],
          records.map(record => record)
        );
      });

    const listOfTeamLeadsWithPracticesDue = getListOfUniqueTeamLeads(
      todaysPractices
    );
    console.log(
      `These people have practices due: ${listOfTeamLeadsWithPracticesDue}`
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

    const sendMessages = createAndDispatchSlackDMs(formattedTodaysPractices);

    return formattedTodaysPractices;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendReminders
};
