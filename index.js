const { PORT } = require("./config");
const { app, receiver } = require("./src/bolt");

const {
  scheduleReminders,
  schedulePracticeGeneration,
  scheduleWeeklyPlan,
  scheduleDailyPlan,
  scheduleOverdueReminder
} = require("./src/schedules");

//scheduleReminders.start(); turning these off to test the response rate
schedulePracticeGeneration.start();
scheduleWeeklyPlan.start();
scheduleDailyPlan.start();
scheduleOverdueReminder.start();

//mount routes for Slack actions and commands
require("./src/routes")(app);

//create a health check endpoint for EB

receiver.app.get("/", (res) => {
  res.json({ status: "Ok" });
  res.status(200).send();
});

(async () => {
  await app.start(PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
