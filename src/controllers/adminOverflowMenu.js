const {
  generatePractices,
  sendWeeklyPlan,
  sendDailyPlan
} = require("../methods");

module.exports = async ({ ack, action, say }) => {
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
        sendWeeklyPlan();
        break;
      case "send_daily_plan":
        sendDailyPlan();
        break;
      default:
        return;
    }
  } catch (error) {
    console.log(error);
  }
};
