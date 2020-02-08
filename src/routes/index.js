const {
  adminOverflowMenu,
  generatePractices,
  showHelp,
  sendReminders,
  slashCommand,
  selectPracticeStatus,
  showFeedbackModal,
  submitFeedbackModal,
  showLogPracticesModal,
  setPracticeStatusFromModal,
  sendWeeklyPlan,
  handleStatusUpdateButton,
  appHomeOpened,
  showWeeklyPlanModal,
  showAppSettingsModal,
  submitAppSettingsModal,
  showDailyPlanModal,
  showProjectSettingsModal,
  submitProjectSettingsModal
} = require("../controllers");
const { authUser } = require("../methods");

module.exports = function(app) {
  app.command("/pilot", authUser, slashCommand);

  app.command("/pbp", authUser, slashCommand);

  app.action("open_practices_log", showLogPracticesModal);

  app.action("show_help", authUser, showHelp);

  app.action("create_practices", authUser, generatePractices);

  app.action("remind_all", authUser, sendReminders);

  app.action("admin_overflow", authUser, adminOverflowMenu);

  app.action("open_feedback_form", showFeedbackModal);

  app.action("select_practice_status", selectPracticeStatus);

  app.action("setPracticeStatusFromModal", setPracticeStatusFromModal);

  app.action("updateStatusButtonComplete", handleStatusUpdateButton);

  app.action("updateStatusButtonMissed", handleStatusUpdateButton);

  app.view("feedback", submitFeedbackModal);

  app.action("send_weekly_plan", authUser, sendWeeklyPlan);

  app.event("app_home_opened", appHomeOpened);

  app.action("openWeekyPLan", showWeeklyPlanModal);

  app.action("showAppSettingsModal", authUser, showAppSettingsModal);

  app.view("submitAppSettingsModal", submitAppSettingsModal);

  app.action("openTodaysPractices", authUser, showDailyPlanModal);

  app.action("showProjectSettingsModal",authUser, showProjectSettingsModal)

  app.view("submitProjectSettingsModal", submitProjectSettingsModal)
};
