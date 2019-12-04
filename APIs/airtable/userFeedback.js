const { TIMEZONE, AIRTABLE_BASE_ID } = require("../../config");
const base = require("airtable").base(AIRTABLE_BASE_ID);
const moment = require("moment-timezone");

const date = moment()
  .tz(TIMEZONE)
  .format("YYYY-MM-DD");

const insertFeedback = async (user, improvement, other) => {
  try {
    console.log(`inserting ${user} ${improvement} ${other}`);
    base("User Feedback")
      .create({
        User: user,
        Date: date,
        Improvement: improvement,
        Other: other
      })
      .then(record => console.log("`Feedback submitted"))
      .catch(error => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = insertFeedback;
