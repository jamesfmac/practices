const moment = require("moment-timezone");

module.exports = (data, body) => {
  const text = `Your practices for the week`;

  const introBlock = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Your practices for the week",
        verbatim: false
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Daily Practices",
        verbatim: false
      }
    }
  ];

  const dailyPracticesBlock = data.dailyPractices.map(practice => {
    console.log(practice);
    const projectList = practice.projects.join(" | ");

    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `>*${practice.name}s* \n>${projectList}`,
          verbatim: false
        }
      }
    ];
  });

  const weekHeaderBlock = [
    {
      type: "divider"
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Weekly Practices`,
        verbatim: false
      }
    }
  ];

  const dayOfWeekBlock = data.week.filter(day=> day.practices.length >0).map(day => {
    const dayHeading = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${moment(day.date).format("dddd, Do MMM")}`,
          verbatim: false
        }
      }
    ];

    const dayOfWeekPractices = day.practices.map(practice => {
      return [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `>*${practice.name}*\n>${practice.project}`,
            verbatim: false
          }
        }
      ];
    });

    const altBody = [
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `N/A`,
            verbatim: false
          }
        ]
      }
    ];

      return [...dayHeading].concat(...dayOfWeekPractices);
   
  
  });

  const blocks = [...introBlock]
    .concat(...dailyPracticesBlock)
    .concat(...weekHeaderBlock)
    .concat(...dayOfWeekBlock);

    console.log(blocks)

  return { text: text, blocks: blocks };
};
