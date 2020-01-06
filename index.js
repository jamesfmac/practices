const { PORT } = require("./config");
const { app, receiver } = require("./src/bolt");

const express = require("express");

const {
  scheduleReminders,
  schedulePracticeGeneration,
  scheduleWeeklyPlan,
  scheduleDailyPlan,
  scheduleOverdueReminder
} = require("./src/schedules");

scheduleReminders.start(); 
schedulePracticeGeneration.start();
scheduleWeeklyPlan.start();
scheduleDailyPlan.start();
scheduleOverdueReminder.start();

//mount routes for Slack actions and commands
require("./src/routes")(app);

//create a health check endpoint for EB

receiver.app.use('/public', express.static('icons'))

receiver.app.get("/", function(req, res, next) {
  res.status(200)
  res.json({ status: "UP" });
  
});

(async () => {
  await app.start(PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
