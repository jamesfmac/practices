const CronJob = require("cron").CronJob;
const { TIMEZONE } = require("../config");
const { generatePractices, sendReminders } = require("../scripts");

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
  "*/10 * * *  1-5",
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
