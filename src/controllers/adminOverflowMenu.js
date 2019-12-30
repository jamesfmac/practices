const {
  generatePractices,
  sendWeeklyPlan,
  sendDailyPlan,
  sendOverdueReminder
} = require("../methods");

const analytics = require("../APIs/segment");

module.exports = async ({ context, ack, action, say }) => {
  try {
    analytics.track({
      userId: context.slackUserID,
      event: "App Button Clicked",
      properties: {
        location: "admin overflow menu",
        button: action.selected_option.text
      }
    });

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
      case "send_overdue_reminders":
        sendOverdueReminder();
        break;
      default:
        return;
    }
  } catch (error) {
    console.log(error);
  }
};
