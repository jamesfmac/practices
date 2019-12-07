const { PORT } = require("./config");
const { app, receiver } = require("./src/bolt");

const {
  scheduleReminders,
  schedulePracticeGeneration,
  scheduleWeeklyPlan
} = require("./src/schedules");

scheduleReminders.start();
schedulePracticeGeneration.start();
scheduleWeeklyPlan.start()

// TODO swtich cron schedules to be explicitly started

// Listener middleware that filters out messages with 'bot_message' subtype
function noBotMessages({ message, next }) {
  if (!message.subtype || message.subtype !== "bot_message") {
    next();
  }
}

//mount routes for Slack actions and commands
require("./src/routes")(app);

//create a health check endpoint for EB

receiver.app.get("/", (req, res, next) => {
  res.json({ status: "Ok" });
  res.status(200).send();
});

(async () => {
  await app.start(PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
