//TODO move these to controllers
const {
  open_practices_logActionHandler,
  show_helpActionHandler,
  create_practicesActionHandler,
  remind_allActionHandler,
  admin_overflowActionHandler
} = require("./slack/actions");

const {
  practicelySlashCommand,
  selectPracticeStatus,
  showFeedbackModal,
  submitFeedbackModal,
  showLogPracticesModal,
  setPracticeStatusFromModal
} = require("./controllers");

module.exports = function(app) {
  app.command('/practicely', practicelySlashCommand);


  app.action("open_practices_log", showLogPracticesModal);

  app.action("show_help", show_helpActionHandler);

  app.action("create_practices", create_practicesActionHandler);

  app.action("remind_all", remind_allActionHandler);

  app.action("admin_overflow", admin_overflowActionHandler);

  app.action("open_feedback_form", showFeedbackModal);

  app.action("select_practice_status", selectPracticeStatus);

  app.action("setPracticeStatusFromModal", setPracticeStatusFromModal)

  app.view("feedback", submitFeedbackModal);
};
