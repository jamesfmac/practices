const CronJob = require("cron").CronJob;
const {TIMEZONE} = require('../config')
const { sendReminders } = require("./sendReminders");

const scheduleReminders = new CronJob(
  "00 15 16 * * 1-5",
  () => {
    sendReminders();
  },
  null,
  true,
  TIMEZONE
);



module.exports = {
  scheduleReminders,
  
};
