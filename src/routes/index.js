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
  updateStatusButtonComplete,
  updateStatusButtonMissed,
  appHomeOpened,
  showWeeklyPlanModal,
  showAppSettingsModal,
  submitAppSettingsModal,
  showDailyPlanModal
} = require("../controllers");

module.exports = function(app) {

  app.command("/pilot", slashCommand);

  app.command("/pbp", slashCommand);

  app.action("open_practices_log", showLogPracticesModal);

  app.action("show_help", showHelp);

  app.action("create_practices", generatePractices);

  app.action("remind_all", sendReminders);

  app.action("admin_overflow", adminOverflowMenu);

  app.action("open_feedback_form", showFeedbackModal);

  app.action("select_practice_status", selectPracticeStatus);

  app.action("setPracticeStatusFromModal", setPracticeStatusFromModal);

  app.action("updateStatusButtonComplete", updateStatusButtonComplete);

  app.action("updateStatusButtonMissed", updateStatusButtonMissed);

  app.view("feedback", submitFeedbackModal);

  app.action("send_weekly_plan", sendWeeklyPlan);

  app.event("app_home_opened", appHomeOpened);

  app.action("openWeekyPLan", showWeeklyPlanModal);

  app.action("showAppSettingsModal", showAppSettingsModal);

  app.view("submitAppSettingsModal", submitAppSettingsModal);

  app.action("openTodaysPractices", showDailyPlanModal);
};
