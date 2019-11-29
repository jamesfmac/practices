const { AIRTABLE_BASE_ID, TIMEZONE } = require("../config");
const base = require("airtable").base(AIRTABLE_BASE_ID);
const moment = require("moment-timezone");
const { postDM } = require("../slack/utils")

const {
  practicesReminder,
  practicesReminderAlt,
  practicesReminderInline
} = require("../slack/messages");

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
    console.log(
      `Sending ${group.practices.length} practices to ${group.email}`
    );

    const blockkitMessage = await practicesReminderInline(group);

    await postDM(
      group.email,
      blockkitMessage.text,
      blockkitMessage.blocks
    );
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

    const teamLeadEmailFilter = userEmail
      ? `Team_Lead_Email="${userEmail}"`
      : `Team_Lead_Email!=""`;

    const date = moment().tz(TIMEZONE);
    const dateFormattedForAirtable = date.format("YYYY-MM-DD");

    const practices = base("Practices Log");

    const lookupFormula = `AND(IS_SAME(Date,"${dateFormattedForAirtable}", 'day' ), Status = 'Pending', ${teamLeadEmailFilter})`;



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

    const sendMessages = createAndDispatchSlackDMs(formattedTodaysPractices);

    return formattedTodaysPractices;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendReminders;
