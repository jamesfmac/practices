const { AIRTABLE_BASE_ID } = require("../../../config");
const base = require("airtable").base(AIRTABLE_BASE_ID);

module.exports = async args => {
  try {
    base("Change Requests")
      .create({
        User: args.user,
        Project: args.project,
        Playbook: args.playbook,
        "End Date": args.endDate,
        Schedules: args.playSchedules
      })
      .then(record => console.log("Request submitted"))
      .catch(error => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
    return error;
  }
};
