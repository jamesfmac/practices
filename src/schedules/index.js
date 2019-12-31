const CronJob = require("cron").CronJob;
const { TIMEZONE } = require("../../config");

const { generatePractices, sendReminders, sendWeeklyPlan, sendDailyPlan, sendOverdueReminder } = require("../methods");

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

const scheduleWeeklyPlan = new CronJob(
  "00 25 09 * * 1",
  () => {
    sendWeeklyPlan();
  },
  null,
  false,
  TIMEZONE
);

const scheduleDailyPlan = new CronJob(
  "00 35 08 * * 1-5",
  () => {
    sendDailyPlan()
  },
  null,
  false,
  TIMEZONE
);

const scheduleOverdueReminder = new CronJob(
  "00 30 15 * * 5",
  () => {
    sendOverdueReminder()
  },
  null,
  false,
  TIMEZONE
);


module.exports = {
  scheduleReminders,
  schedulePracticeGeneration,
  scheduleWeeklyPlan,
  scheduleDailyPlan,
  scheduleOverdueReminder
};
