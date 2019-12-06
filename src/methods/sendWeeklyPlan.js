const { AIRTABLE_BASE_ID, TIMEZONE } = require("../../config");
const moment = require("moment-timezone");
const { weeklyPlan } = require("../views");
const { chatPostDM } = require("../APIs/slack");
const {getPracticesLog} = require("../APIs/airtable")

module.exports = () => {
  const testData = {
    dailyPractices: [
      { practice: "Daily standup", projects: ["MYOB", "ACME", "Squad Red"] }
    ],
    week: [
      {
        date: "Monday December 12th",
        practices: [{ practice: "Invoicing", project: "MYOB" }]
      },
      {
        date: "Tuesday December 13th",
        practices: [
          { practice: "Steering Co Meeting", project: "MYOB" },
          { practice: "Sprint Retro", project: "ACME" }
        ]
      },
      {
        date: "Wednesday December 14th",
        practices: []
      },
      {
        date: "Thursday December 15th",
        practices: [{ practice: "Sprint Planning", project: "MYOB" }]
      },
      {
        date: "Friday December 16th",
        practices: []
      }
    ]
  };

  //define date range for the current week 

  const date = moment().tz(TIMEZONE);
  const startOfWeek = date.startOf("isoWeek").subtract(1,'day').format("YYYY-MM-DD");
  const endOfWeek = date.endOf("isoWeek").add(1,'day').format("YYYY-MM-DD");

  console.log(startOfWeek, endOfWeek);

  //get practices for that range

  const allPractices = getPracticesLog({
      afterDate: startOfWeek,
      beforeDate: endOfWeek
  })

  

  //Extract list of team leads

  //extract daily practices

  //format weekly data

  //create view

  const view = weeklyPlan(testData);

  //send message
  chatPostDM("stratejossandbox@gmail.com", view.text, view.blocks);

 
};
