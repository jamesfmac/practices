const { generatePractices, sendWeeklyPlan } = require("../methods");
const { usersInfo } = require("../APIs/slack");
module.exports = async ({ ack, action, payload, body, say }) => {
  try {
    ack();
    const selectedMenuOption = action.selected_option.value;
    switch (selectedMenuOption) {
      case "create_practices":
        generatePractices();
        break;
      case "show_stats":
        say("Whoops you caught me before I was ready. Stats are coming soon.");
        break;
      case "send_weekly_plan":
        const slackUserInfo = await usersInfo(body.user.id);
        sendWeeklyPlan(slackUserInfo.profile.email);
        break;
      default:
        return;
    }
  } catch (error) {
    console.log(error);
  }
};
