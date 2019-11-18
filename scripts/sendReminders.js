const { AIRTABLE_API_KEY } = require("../config");
const base = require("airtable").base("appQHyg8VRIOEuor7");
const timezone = "Australia/Sydney";
const { sendSlackDM } = require("../sendSlackDM");

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
    console.log(formattedTodaysPractices);

    //Create and send the Slack messages

    const sendMessages =  await formattedTodaysPractices.forEach(x => {
      console.log(`Sending ${x.practices.length} practices to ${x.email}`);

      const text = `You have ${x.practices.length} practices to review`;
      const blocks = [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: text
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",

              text: {
                type: "plain_text",
                text: "Update Practices"
              },
              url: String(x.practices[0].viewURL),
              action_id: "view_practices"
            }
          ]
        }
      ];

     sendSlackDM(x.email, text, blocks);
    });

    return formattedTodaysPractices;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendReminders
};
