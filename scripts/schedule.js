const CronJob = require("cron").CronJob;
const { TIMEZONE } = require("../config");
const { sendReminders } = require("./sendReminders");
const { generatePractices } = require("./generatePractices");

const scheduleReminders = new CronJob(
  "00 15 16 * * 1-5",
  () => {
    sendReminders();
  },
  null,
  true,
  TIMEZONE
);

const schedulePracticeGeneration = new CronJob(
  "5 */1 * *  1-5",
  () => {
    generatePractices();
  },
  null,
  true,
  TIMEZONE
);

module.exports = {
  scheduleReminders,
  schedulePracticeGeneration
};
