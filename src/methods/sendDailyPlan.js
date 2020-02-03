const { getTeamLeads } = require("../APIs/airtable");
const { usersLookupByEmail, chatPostDM } = require("../APIs/slack");
const generateDailyPlan = require("../controllers/generateDailyPlan"); //importing directly to get around a loading order issue
const analytics = require("../APIs/segment");

module.exports = async () => {
  try {
    console.log("sendDailyPlan ran");
    const teamLeads = await getTeamLeads(null);

    for (const teamLead of teamLeads) {
      const userEmail = teamLead.fields["Email Address"];
      const userPlannedPracticesSettings =
        teamLead.fields["Planned Practices Reminder"];

      const userWantsDailyPlan = userPlannedPracticesSettings
        ? userPlannedPracticesSettings.includes("Daily")
        : false;

      console.log("email address", userEmail);
      const slackUser = await usersLookupByEmail(userEmail);

      const slackUserID = slackUser.ok ? slackUser.user.id : false;

      if (slackUserID && userWantsDailyPlan) {
        const dailyPlan = await generateDailyPlan({
          email: userEmail,
          userID: slackUserID,
          isForModal: false
        });

        if (dailyPlan.practices.length > 0) {
          const chatPostResult = await chatPostDM(
            dailyPlan.userEmail,
            dailyPlan.view.text,
            dailyPlan.view.blocks
          );

          chatPostResult.ok
            ? analytics.track({
                userId: slackUserID,
                event: `Message Recieved`,
                properties: {
                  message: "Daily Plan"
                }
              })
            : null;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
