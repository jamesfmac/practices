const { AIRTABLE_API_KEY } = require("../config");
const base = require("airtable").base("appQHyg8VRIOEuor7");
const timezone = "Australia/Sydney";
const { sendDM } = require ('../sendDM')

//Set up the dates that we need to find the practices due today
const moment = require("moment-timezone");
const date = moment().tz(timezone);
const week = () => {
  return date.week() % 2 ? 2 : 1;
};



const dateFormattedForAirtable = date.format("YYYY-MM-DD");

function groupPracticesByTeamLeadEmail(list, email) {
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
          project: record.fields.Project[0],
          date: record.fields.Date,
          status: record.fields.Status,
          viewURL: record.fields.TEAM_LEAD_PRACTICES_URL[0]
        };
      })
  );
}

function getListOfUniqueTeamLeads(list) {
  return list
    .map(item => item.fields.TEAM_LEAD_EMAIL[0])
    .filter((person, index, all) => all.indexOf(person) === index);
}

const sendReminders = async (app, date) => {
  try {
    console.log(`Sending practice reminders for: ${date}`);
    const practices = base("Practices Log");
    const lookupFormula = `AND(IS_SAME(Date,"${date}", 'day' ), Status = 'Pending',Team_Lead_Email!="" )`;

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
    console.log(formattedTodaysPractices);

    //Create and send the Slack messages

    const sendMessages = await formattedTodaysPractices.forEach(element => {
        console.log(`Sending ${element.practices.length} practices to ${element.email}`)
    });

    return formattedTodaysPractices;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendReminders
};
