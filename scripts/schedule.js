const CronJob = require("cron").CronJob;
const { TIMEZONE } = require("../config");

const generatePractices = require("./generatePractices")
const sendReminders = require("./sendReminders")


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
  "00 */10 * * *  1-5",
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
