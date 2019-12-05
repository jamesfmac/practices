const CronJob = require("cron").CronJob;
const { TIMEZONE } = require("../../config");

const { generatePractices, sendReminders } = require("../methods");

const scheduleReminders = new CronJob(
  "00 15 16 * * 1-5",
  () => {
    sendReminders();
  },
  null,
  false,
  TIMEZONE
);

const schedulePracticeGeneration = new CronJob(
  "00 */10 * * *  1-5",
  () => {
    generatePractices();
  },
  null,
  false,
  TIMEZONE
);

module.exports = {
  scheduleReminders,
  schedulePracticeGeneration
};
