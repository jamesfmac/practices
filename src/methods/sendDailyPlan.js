const { getTeamLeads } = require("../APIs/airtable");
const { usersLookupByEmail, chatPostDM } = require("../APIs/slack");
const generateDailyPlan = require("../controllers/generateDailyPlan"); //importing directly to get around a loading order issue

module.exports = async () => {
  try {
    console.log("sendDailyPlan ran");
    const teamLeads = await getTeamLeads(null);

    for (const teamLead of teamLeads) {
      const userEmail = teamLead.fields["Email Address"];
      const userWantsDailyPlan =
        teamLead.fields["Send Daily Planned Practices"];

      console.log("email address", userEmail);
      const slackUser = await usersLookupByEmail(userEmail);

      const slackUserID = slackUser.ok ? slackUser.user.id : null;

      if (slackUserID && userWantsDailyPlan) {
        const dailyPlan = await generateDailyPlan({
          email: userEmail,
          userID: slackUserID,
          isForModal: false
        });

        chatPostDM(
          dailyPlan.userEmail,
          dailyPlan.view.text,
          dailyPlan.view.blocks
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};
