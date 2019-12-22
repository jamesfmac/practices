const moment = require("moment-timezone");
const { TIMEZONE } = require("../../config");
const {
  getTeamLeads,
  getTeamLeadFromSlackID,
  updateTeamLeads
} = require("../APIs/airtable");
const { usersInfo } = require("../APIs/slack");

module.exports = async ({ payload, body, context, next, say, ack }) => {
  try {
    console.log("middleware hit with payload", payload);
    //setup timestamp
    const timestamp = moment()
      .tz(TIMEZONE)
      .format("YYYY-MM-DD HH:MM");

    //handle slack putting the user id in different places depending on the event
    const getSlackID = (payload, body) => {
      if (payload.user) {
        return payload.user;
      } else if (body.user_id) {
        return body.user_id;
      } else if (body.user) {
        return body.user.id;
      }
    };
    const slackUserID = getSlackID(payload, body);
    const slackUser = await usersInfo(slackUserID);
    const slackEmailAddress = slackUser.profile.email;
    const teamLead = await getTeamLeadFromSlackID(slackUserID);

    if (await teamLead[0]) {
      context.slackUserID = slackUserID;
      context.userEmail = slackEmailAddress;
      context.isPbPAdmin = teamLead[0].get("Practices Admin");
      context.PbPRecordID = teamLead[0].id;

      console.log("team lead found");

      updateTeamLeads([
        {
          id: teamLead[0].id,
          fields: {
            "Last Seen": timestamp
          }
        }
      ]);
      next();
    } else {
      //attempt to slack user to an existing account
      console.log("Attempting to link account");
      const matchedTeamLead = await getTeamLeads(slackEmailAddress);

      if (await matchedTeamLead[0]) {
        const matchedRecordID = matchedTeamLead[0].id;
        console.log("matched user", matchedRecordID);
        await updateTeamLeads([
          {
            id: matchedRecordID,
            fields: {
              "Slack User ID": slackUserID,
              "Last Seen": timestamp
            }
          }
        ]);

        context.slackUserID = slackUserID;
        context.userEmail = slackEmailAddress;
        context.isPbPAdmin = matchedTeamLead[0].get("Practices Admin");
        context.PbPRecordID = matchedTeamLead[0].id;
        next();
      } else {
        ack();
        console.log(`No account found for${slackEmailAddress}`);
        say("Sorry it looks like you don't have a Playbook Pilot account");
      }
    }
  } catch (error) {
    console.log(error);
  }
};
